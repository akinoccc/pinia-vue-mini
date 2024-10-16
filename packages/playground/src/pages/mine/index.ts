import { useTestStore } from "@/store/test";
import { defineComponent } from '@vue-mini/core';

defineComponent(() => {
  const {count, doubleCount, increment} = useTestStore()
  return {
    count,
    doubleCount,
    increment,
  };
});
