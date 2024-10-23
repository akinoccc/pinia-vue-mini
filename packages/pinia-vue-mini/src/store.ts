import {
  ComputedRef,
  effectScope,
  inject,
  isReactive,
  isRef,
  reactive,
  toRaw,
  UnwrapRef,
  watch,
} from '@vue-mini/core'
import { activePinia, Pinia, piniaSymbol, setActivePinia } from './rootStore'
import { UnwrapRefs } from './types'

export interface StoreOptions {
  persist?: boolean
}

export function defineStore<SS extends object>(id: string, setup: () => SS, options?: StoreOptions) {
  function useStore(pinia?: Pinia | null): UnwrapRefs<SS> {
    pinia = inject(piniaSymbol, null)
   
    if (pinia) setActivePinia(pinia)

    pinia = activePinia!

    if (!pinia._s.has(id))
      createSetupStore<SS>(id, setup, pinia, options)
      
    const store = pinia._s.get(id)!

    return store
  };

  useStore.$id = id

  return useStore
}

function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
function isComputed(o: unknown): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}

function createSetupStore<SS extends object>(
  $id: string,
  setup: () => SS,
  pinia: Pinia,
  options?: StoreOptions,
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

  let storageState = {} as any
  if (options?.persist)
    storageState = wx.getStorageSync<SS>($id)

  for (const key in setupStore) {
    const prop = setupStore[key]

    if (options?.persist) {
      if (isRef(prop))
        prop.value = storageState[key] ?? prop.value

      if (isReactive(prop))
        deepRestoreReactive(prop, storageState[key])
    }
  
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop))
      pinia.state.value[$id][key] = prop
  }
  
  Object.assign(store, setupStore)
  // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object.
  // Make `storeToRefs()` work with `reactive()`
  Object.assign(toRaw(store), setupStore)

  if (options?.persist)
    watch(() => store, () => {
      wx.setStorageSync($id, pinia.state.value[$id])
    }, { deep: true })

  return store
}

// 深度恢复 reactive 对象
function deepRestoreReactive(target: any, source: any) {
  if (!source) return

  Object.keys(source).forEach((key) => {
    const targetProp = target[key]
    const sourceProp = source[key]

    if (isRef(targetProp))
      // 恢复 ref 的值
      targetProp.value = sourceProp
    else if (isReactive(targetProp))
      // 递归恢复嵌套的 reactive 对象
      deepRestoreReactive(targetProp, sourceProp)
    else
      // 原始值的赋值
      target[key] = sourceProp
  })
}
