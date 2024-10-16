import { isReactive, isRef, toRaw, toRef } from '@vue-mini/core'
import { StateTree, StoreToRefs } from './types'

export function storeToRefs<SS extends object>(
  store: SS,
) {
  store = toRaw(store)
  
  const refs: StateTree = {}
  for (const key in store) {
    const value = store[key]
    if (isRef(value) || isReactive(value))
      refs[key] = toRef(store, key)
  }
  
  return refs as StoreToRefs<SS>
}
