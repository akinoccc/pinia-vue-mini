import {
  type EffectScope,
  effectScope,
  markRaw,
  provide,
  ref,
  Ref,
} from '@vue-mini/core';
import { StoreGeneric } from './types';

type StateTree = Record<string | number | symbol, any>;

export interface Pinia {
  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>;

  // /**
  //  * Adds a store plugin to extend every store
  //  *
  //  * @param plugin - store plugin to add
  //  */
  // use(plugin: PiniaPlugin): Pinia

  // /**
  //  * Installed store plugins
  //  *
  //  * @internal
  //  */
  // _p: PiniaPlugin[]

  /**
   * Effect scope the pinia is attached to
   *
   * @internal
   */
  _effectScope: EffectScope;

  /**
   * Registry of stores used by this pinia.
   *
   * @internal
   */
  _state: Map<string, StoreGeneric>;
}

export function createPinia(): Pinia {
  const scope = effectScope(true);
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!;

  const pinia: Pinia = {
    _effectScope: scope,
    _state: new Map<string, StoreGeneric>(),
    state,
  };

  provide('$pinia', pinia);

  return pinia;
}
