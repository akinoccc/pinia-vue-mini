import {
  ComputedRef,
  effectScope,
  inject,
  isReactive,
  isRef,
  reactive,
  toRaw,
  UnwrapRef,
} from '@vue-mini/core'
import { activePinia, Pinia, piniaSymbol, setActivePinia } from './rootStore'
import { UnwrapRefs } from './types'

export function defineStore<SS>(id: string, setup: () => SS) {
  function useStore(pinia?: Pinia | null) {
    pinia = inject(piniaSymbol, null)
   
    if (pinia) setActivePinia(pinia)

    pinia = activePinia!

    if (!pinia._s.has(id))
      createSetupStore<SS>(id, setup, pinia)
      
    const store = pinia._s.get(id)!
    return store as UnwrapRefs<SS>
  };

  useStore.$id = id

  return useStore
}

function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
function isComputed(o: unknown): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}

function createSetupStore<SS>(
  $id: string,
  setup: () => SS,
  pinia: Pinia,
) {
  // internal state
  const initialState = pinia.state.value[$id] as UnwrapRef<SS> | undefined

  if (!initialState)
    pinia.state.value[$id] = {}

  // function $dispose() {
  //   scope.stop()
  //   pinia._s.delete($id)
  // }

  // const partialStore = {
  //   _p: pinia,
  //   $id,
  //   $dispose,
  // }

  const store = reactive({})

  pinia._s.set($id, store)

  const setupStore = pinia._e.run(() => effectScope())!.run(() => setup())

  for (const key in setupStore) {
    const prop = setupStore[key]
  
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop))
      pinia.state.value[$id][key] = prop
  }
  
  Object.assign(store, setupStore)
  // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object.
  // Make `storeToRefs()` work with `reactive()`
  Object.assign(toRaw(store), setupStore)

  return store
}
