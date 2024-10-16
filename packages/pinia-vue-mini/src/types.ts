import { ComputedRef, Ref } from '@vue-mini/core'

/**
 * Store 的泛型状态树
 */
export type StateTree = Record<string | number | symbol, any>

// 用于解包 Ref
export type UnwrapRefs<T> = {
  [K in keyof T]: T[K] extends Ref<infer U> ? U : T[K];
}

export type StoreToRefs<T> = {
  [K in keyof T as T[K] extends () => unknown | ComputedRef<unknown> ? never : K]: T[K];
}
