import {
  computed,
  ComputedRef,
  effectScope,
  EffectScope,
  inject,
  isReactive,
  isRef,
  markRaw,
  reactive,
  toRaw,
  toRefs,
  UnwrapRef,
} from '@vue-mini/core'
import { activePinia, Pinia, piniaSymbol, setActivePinia } from './rootStore'
import {
  _ActionsTree,
  _ExtractActionsFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractStateFromSetupStore,
  _GettersTree,
  _Method,
  _StoreWithState,
  DefineSetupStoreOptions,
  DefineStoreOptions,
  StateTree,
  Store,
  StoreDefinition,
  StoreGeneric,
} from './types'

// interface DefineStoreOptions {
//   state: () => StateTree;
//   getters?: Record<string | number | symbol, () => any>;
//   actions?: Record<string | number | symbol, () => any>;
// };
// type DefineSetupStoreOptions = () => any;
/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {},
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {},
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param storeSetup - function that defines the store
 * @param options - extra options
 */
export function defineStore<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
>

export function defineStore(idOrOptions: any,
  setup?: any,
  setupOptions?: any,
): StoreDefinition {
  let id: string
  let options:
    | DefineStoreOptions<
      string,
      StateTree,
      _GettersTree<StateTree>,
      _ActionsTree
    >
    | DefineSetupStoreOptions<
      string,
      StateTree,
      _GettersTree<StateTree>,
      _ActionsTree
    >

  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    // the option store setup will contain the actual options in this case
    options = isSetupStore ? setupOptions : setup
  }
  else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore(pinia?: Pinia | null): StoreGeneric {
    pinia = inject(piniaSymbol, null)
   
    if (pinia) setActivePinia(pinia)

    pinia = activePinia!

    if (!pinia._s.has(id))
      if (isSetupStore)
        createSetupStore(id, setup, pinia)
      else
        createOptionsStore(id, options as any, pinia)
    
    const store: StoreGeneric = pinia._s.get(id)!
    return store as any
  };

  useStore.$id = id

  return useStore
}

function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree,
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
) {
  const { state, actions, getters } = options

  const initialState: StateTree | undefined = pinia.state.value[id]

  function setup() {
    if (!initialState)
      pinia.state.value[id] = state ? state() : {}

    // avoid creating a state in pinia.state.value
    const localState = toRefs(pinia.state.value[id])

    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce(
        (computedGetters, name) => {
          computedGetters[name] = markRaw(
            computed(() => {
              setActivePinia(pinia)
              const store = pinia._s.get(id)!

              // return getters![name].call(context, context)
              // TODO: avoid reading the getter while assigning with a global variable
              return getters![name].call(store, store)
            }),
          )
          return computedGetters
        },
        {} as Record<string, ComputedRef>,
      ),
    ) as any
  }

  return createSetupStore(id, setup, pinia, true)
}

function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
function isComputed(o: any): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}

function createSetupStore<
  Id extends string,
  SS extends Record<any, unknown>,
  S extends StateTree,
  G extends Record<string, _Method>,
  A extends _ActionsTree,
>(
  $id: Id,
  setup: () => SS,
  pinia: Pinia,
  isOptionsStore?: boolean,
) {
  let scope!: EffectScope

  // internal state
  const initialState = pinia.state.value[$id] as UnwrapRef<S> | undefined

  // avoid setting the state for option stores if it is set
  // by the setup
  if (!isOptionsStore && !initialState)
    pinia.state.value[$id] = {}

  function $dispose() {
    scope.stop()
    pinia._s.delete($id)
  }

  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $dispose,
  } as _StoreWithState<Id, S, G, A>

  const store: Store<Id, S, G, A> = reactive(partialStore) as unknown as Store<Id, S, G, A>

  // store the partial store now so the setup of stores can instantiate each other before they are finished without
  // creating infinite loops.
  pinia._s.set($id, store as Store)

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
  const setupStore = pinia._e.run(() => (scope = effectScope()).run(() => setup())!)

  // overwrite existing actions to support $onAction
  for (const key in setupStore) {
    const prop = setupStore[key]
  
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop))
    // mark it as a piece of state to be serialized
      if (!isOptionsStore) {
        // in setup stores we must hydrate the state and sync pinia state tree with the refs the user just created
        if (initialState)
          if (isRef(prop))
            prop.value = initialState[key as keyof UnwrapRef<S>]
          else
          // probably a reactive object, lets recursively assign
          // @ts-expect-error: prop is unknown
            mergeReactiveObjects(prop, initialState[key])

        pinia.state.value[$id][key] = prop
        console.log(pinia.state.value[$id])
      }
  }
  
  Object.assign(store, setupStore)
  // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object.
  // Make `storeToRefs()` work with `reactive()` #799
  Object.assign(toRaw(store), setupStore)

  return store
}
