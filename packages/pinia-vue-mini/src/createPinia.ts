import {
  effectScope,
  markRaw,
  provide,
  ref,
  Ref
} from '@vue-mini/core';
import { Pinia, piniaSymbol, setActivePinia } from './rootStore';
import { StateTree } from './types';

export function createPinia(): Pinia {
  const scope = effectScope(true);
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!;

  const pinia: Pinia = markRaw({
    _e: scope,
    _s: new Map<string, any>(),
    state,
  });

  setActivePinia(pinia);

  provide(piniaSymbol, pinia);

  return pinia;
}

export function disposePinia(pinia: Pinia) {
  pinia._e.stop();
  pinia._s.clear();
  pinia.state.value = {};
}
