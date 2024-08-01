import { effectScope, EffectScope, inject } from "@vue-mini/core";
import { Pinia } from "./createPinia";

export function defineStore(id: string, options: () => Record<string, any>) {
  const pinia = inject<Pinia>("$pinia")!;

  console.log(pinia);
  createSetupStore(id, options, pinia);

  return function useStore() {
    console.log(pinia._state.get(id).age, 888);
    return pinia._state.get(id);
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
  console.log(11, _state.age);
  // Object.assign(initialState, _state);
  pinia.state.value[id] = _state;

  pinia._state.set(id, _state);
  console.log(_state.age, pinia.state.value[id].age, 1111);
}
