import { ComputedRef, isReactive, isRef, Ref, toRaw, ToRef, toRef, ToRefs } from "@vue-mini/core"
import { _ActionsTree, _GettersTree, _UnwrapAll, PiniaCustomStateProperties, StateTree, Store, StoreGeneric } from "./pinia.types"

type ToComputedRefs<T> = {
    [K in keyof T]: ToRef<T[K]> extends Ref<infer U>
      ? ComputedRef<U>
      : ToRef<T[K]>
  }
  
  /**
   * Extracts the refs of a state object from a store. If the state value is a Ref or type that extends ref, it will be kept as is.
   * Otherwise, it will be converted into a Ref. **Internal type DO NOT USE**.
   */
  type _ToStateRefs<SS> =
    SS extends Store<
      string,
      infer UnwrappedState,
      _GettersTree<StateTree>,
      _ActionsTree
    >
      ? UnwrappedState extends _UnwrapAll<Pick<infer State, infer Key>>
        ? {
            [K in Key]: ToRef<State[K]>
          }
        : ToRefs<UnwrappedState>
      : ToRefs<StoreState<SS>>

/**
 * Extracts the return type for `storeToRefs`.
 * Will convert any `getters` into `ComputedRef`.
 */
export type StoreToRefs<SS extends StoreGeneric> = _ToStateRefs<SS> &
  ToRefs<PiniaCustomStateProperties<StoreState<SS>>> &
    ToComputedRefs<StoreGetters<SS>>
  

export function storeToRefs<SS extends StoreGeneric>(
    store: SS
  ): StoreToRefs<SS> {
      store = toRaw(store)
  
      const refs = {} as StoreToRefs<SS>
      for (const key in store) {
        const value = store[key]
        if (isRef(value) || isReactive(value)) {
          // @ts-expect-error: the key is state or getter
          
          refs[key] = toRef(store, key)
        }
      }
  
      return refs
  }