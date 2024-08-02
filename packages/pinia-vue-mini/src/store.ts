import { effectScope, EffectScope, inject, ref } from '@vue-mini/core';
import { Pinia } from './createPinia';
import { StateTree } from './types';

interface DefineStoreOptions {
  state: () => StateTree;
  getters?: Record<string | number | symbol, () => any>;
  actions?: Record<string | number | symbol, () => any>;
};
type DefineSetupStoreOptions = () => StateTree;

export function defineStore(id: string, options: DefineStoreOptions | DefineSetupStoreOptions) {
  return function useStore() {
    const pinia = inject<Pinia>('$pinia')!;
    if (!pinia._state.has(id)) {
      if (typeof options === 'function')
        createSetupStore(id, options as DefineSetupStoreOptions, pinia);
      else
        createOptionsStore(id, options as DefineStoreOptions, pinia);
    }
    console.log(pinia._state.get(id), 33)
    return {
      age: ref(18)
    };
  };
}

function createOptionsStore(
  id: string,
  options: DefineStoreOptions,
  pinia: Pinia
) {
  const { state, actions, getters } = options

  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: any

  let scope

  function setup() {
    const _state = {}
    const t = state()
    for (const k in t ){
      _state[k] = ref(t[k])
    }

    pinia.state.value[id] = _state
    const age = ref(18)
    return {
      age
    }
    // let localState = toRefs(pinia.state.value[id])
    // return Object.assign(
    //   localState,
    //   actions,
    //   Object.keys(getters || {}).reduce(
    //     (computedGetters, name) => {

    //       computedGetters[name] = markRaw(
    //         computed(() => {
    //           // it was created just before
    //           const store = pinia._state.get(id)!

    //           // @ts-expect-error
    //           // return getters![name].call(context, context)
    //           // TODO: avoid reading the getter while assigning with a global variable
    //           return getters![name].call(store, store)
    //         })
    //       )
    //       return computedGetters
    //     },
    //     {} as Record<string, ComputedRef>
    //   )
    // )
  }

  let setupStore = createSetupStore(id, setup, pinia);
  // Object.assign(store, setupStore);
  // pinia._state.set(id, setupStore);
}

function createSetupStore(
  id: string,
  setup: DefineSetupStoreOptions,
  pinia: Pinia
) {
  let scope: EffectScope = effectScope(true);

  if (!pinia.state.value[id]) {
    pinia.state.value[id] = {};
  }
  // internal state
  const initialState = pinia.state.value[id];

  const _state = scope.run(() => setup());
  console.log('setip', _state)
  Object.assign(initialState, _state);
  pinia._state.set(id, _state);
  return _state
}
