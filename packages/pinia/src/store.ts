import { effectScope, EffectScope, inject } from '@vue-mini/core';
import { Pinia } from './createPinia';

export function defineStore(id: string, options: () => Record<string, any>) {
  const pinia = inject<Pinia>('pinia')!;
  createSetupStore(id, options, pinia);

  return function useStore() {
    return pinia.state.value[id];
  };
}

function createSetupStore(
  id: string,
  setup: () => Record<string, any>,
  pinia: Pinia
) {
  let scope: EffectScope = effectScope(true);

  if (!pinia.state.value[id]) {
    pinia.state.value[id] = {};
  }

  // internal state
  const initialState = pinia.state.value[id];

  const _state = scope.run(() => setup());
  Object.assign(initialState, _state);
}
