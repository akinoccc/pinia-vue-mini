import { UnwrapRef } from '@vue-mini/core'
import { Pinia } from './rootStore'

/**
 * Generic state of a Store
 */
export type StateTree = Record<string | number | symbol, any>

export type Store<
  Id extends string = string,
  S extends StateTree = {},
  G /* extends GettersTree<S> */ = {},
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = {},
> = _StoreWithState<Id, S, G, A> &
UnwrapRef<S> &
_StoreWithGetters<G> &
(_ActionsTree extends A ? {} : A)

/**
 * Generic and type-unsafe version of Store. Doesn't fail on access with
 * strings, making it much easier to write generic functions that do not care
 * about the kind of store that is passed.
 */
export type StoreGeneric = Store<
  string,
  StateTree,
  _GettersTree<StateTree>,
  _ActionsTree
>

export type _GettersTree<ST> = Record<string, (state: ST) => any>

/**
 * Type of an object of Actions. For internal usage only.
 * For internal use **only**
 */
export type _ActionsTree = Record<string, _Method>

export type _Method = (...args: any[]) => any

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export interface StoreDefinition<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S> */ = _GettersTree<S>,
  A /* extends ActionsTree */ = _ActionsTree,
> {
  /**
     * Returns a store, creates it if necessary.
     *
     * @param pinia - Pinia instance to retrieve the store
     */
  (pinia?: Pinia | null | undefined): Store<Id, S, G, A>

  /**
     * Id of the store. Used by map helpers.
     */
  $id: Id
}

/**
 * For internal use **only**
 */
export type _ExtractStateFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractStateFromSetupStore_Keys<SS> extends keyof SS
    ? _UnwrapAll<Pick<SS, _ExtractStateFromSetupStore_Keys<SS>>>
    : never

/**
 * For internal use **only**
 */
export type _ExtractActionsFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractActionsFromSetupStore_Keys<SS> extends keyof SS
    ? Pick<SS, _ExtractActionsFromSetupStore_Keys<SS>>
    : never

/**
 * For internal use **only**
 */
export type _ExtractGettersFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractGettersFromSetupStore_Keys<SS> extends keyof SS
    ? Pick<SS, _ExtractGettersFromSetupStore_Keys<SS>>
    : never

/**
 * Options parameter of `defineStore()` for option stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineStoreOptions<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends Record<string, StoreAction> */,
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  /**
     * Unique string key to identify the store across the application.
     */
  id: Id

  /**
     * Function to create a fresh state. **Must be an arrow function** to ensure
     * correct typings!
     */
  state?: () => S

  /**
     * Optional object of getters.
     */
  getters?: G &
  ThisType<UnwrapRef<S> & _StoreWithGetters<G> & PiniaCustomProperties> &
  _GettersTree<S>

  /**
     * Optional object of actions.
     */
  actions?: A &
  ThisType<
    A &
    UnwrapRef<S> &
    _StoreWithState<Id, S, G, A> &
    _StoreWithGetters<G> &
    PiniaCustomProperties
  >

  /**
     * Allows hydrating the store during SSR when complex state (like client side only refs) are used in the store
     * definition and copying the value from `pinia.state` isn't enough.
     *
     * @example
     * If in your `state`, you use any `customRef`s, any `computed`s, or any `ref`s that have a different value on
     * Server and Client, you need to manually hydrate them. e.g., a custom ref that is stored in the local
     * storage:
     *
     * ```ts
     * const useStore = defineStore('main', {
     *   state: () => ({
     *     n: useLocalStorage('key', 0)
     *   }),
     *   hydrate(storeState, initialState) {
     *     // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
     *     storeState.n = useLocalStorage('key', 0)
     *   }
     * })
     * ```
     *
     * @param storeState - the current state in the store
     * @param initialState - initialState
     */
  hydrate?(storeState: UnwrapRef<S>, initialState: UnwrapRef<S>): void
}

/**
 * Options parameter of `defineStore()` for setup stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineSetupStoreOptions<
  Id extends string,
  // NOTE: Passing SS seems to make TS crash
  S extends StateTree,
  G,
  A /* extends ActionsTree */,
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  /**
     * Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
     * creating the store. Can be used in plugins to get the list of actions in a
     * store defined with a setup function. Note this is always defined
     */
  actions?: A
}

/**
 * Base store with state and functions. Should not be used directly.
 */
export interface _StoreWithState<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<StateTree> */,
  A /* extends ActionsTree */,
> extends StoreProperties<Id> {
  /**
     * State of the Store. Setting it will internally call `$patch()` to update the state.
     */
  //   $state: UnwrapRef<S> & PiniaCustomStateProperties<S>

  //   /**
  //    * Applies a state patch to current state. Allows passing nested values
  //    *
  //    * @param partialState - patch to apply to the state
  //    */
  //   $patch(partialState: _DeepPartial<UnwrapRef<S>>): void

  //   /**
  //    * Group multiple changes into one function. Useful when mutating objects like
  //    * Sets or arrays and applying an object patch isn't practical, e.g. appending
  //    * to an array. The function passed to `$patch()` **must be synchronous**.
  //    *
  //    * @param stateMutator - function that mutates `state`, cannot be asynchronous
  //    */
  //   $patch<F extends (state: UnwrapRef<S>) => any>(
  //     // this prevents the user from using `async` which isn't allowed
  //     stateMutator: ReturnType<F> extends Promise<any> ? never : F
  //   ): void

  //   /**
  //    * Resets the store to its initial state by building a new state object.
  //    */
  //   $reset(): void

  //   /**
  //    * Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
  //    * that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
  //    * component gets unmounted unless `detached` is set to true.
  //    *
  //    * @param callback - callback passed to the watcher
  //    * @param options - `watch` options + `detached` to detach the subscription from the context (usually a component)
  //    * this is called from. Note that the `flush` option does not affect calls to `store.$patch()`.
  //    * @returns function that removes the watcher
  //    */
  //   $subscribe(
  //     callback: SubscriptionCallback<S>,
  //     options?: { detached?: boolean } & WatchOptions
  //   ): () => void

  //   /**
  //    * Setups a callback to be called every time an action is about to get
  //    * invoked. The callback receives an object with all the relevant information
  //    * of the invoked action:
  //    * - `store`: the store it is invoked on
  //    * - `name`: The name of the action
  //    * - `args`: The parameters passed to the action
  //    *
  //    * On top of these, it receives two functions that allow setting up a callback
  //    * once the action finishes or when it fails.
  //    *
  //    * It also returns a function to remove the callback. Note than when calling
  //    * `store.$onAction()` inside of a component, it will be automatically cleaned
  //    * up when the component gets unmounted unless `detached` is set to true.
  //    *
  //    * @example
  //    *
  //    *```js
  //    *store.$onAction(({ after, onError }) => {
  //    *  // Here you could share variables between all of the hooks as well as
  //    *  // setting up watchers and clean them up
  //    *  after((resolvedValue) => {
  //    *    // can be used to cleanup side effects
  //    * .  // `resolvedValue` is the value returned by the action, if it's a
  //    * .  // Promise, it will be the resolved value instead of the Promise
  //    *  })
  //    *  onError((error) => {
  //    *    // can be used to pass up errors
  //    *  })
  //    *})
  //    *```
  //    *
  //    * @param callback - callback called before every action
  //    * @param detached - detach the subscription from the context this is called from
  //    * @returns function that removes the watcher
  //    */
  //   $onAction(
  //     callback: StoreOnActionListener<Id, S, G, A>,
  //     detached?: boolean
  //   ): () => void

  /**
     * Stops the associated effect scope of the store and remove it from the store
     * registry. Plugins can override this method to cleanup any added effects.
     * e.g. devtools plugin stops displaying disposed stores from devtools.
     * Note this doesn't delete the state of the store, you have to do it manually with
     * `delete pinia.state.value[store.$id]` if you want to. If you don't and the
     * store is used again, it will reuse the previous state.
     */
  $dispose(): void

  /**
     * Vue 2 only. Is the store ready. Used for store cross usage. Getters automatically compute when they are added to
     * the store, before the store is actually ready, this allows to avoid calling the computed function yet.
     *
     * @internal
     */
  _r?: boolean
}

/**
 * Store augmented with getters. For internal usage only.
 * For internal use **only**
 */
export type _StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R
    ? R
    : UnwrapRef<G[k]>
}
