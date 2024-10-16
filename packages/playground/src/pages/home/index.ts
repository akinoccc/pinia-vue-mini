import { useTestStore } from "@/store/test";
import { defineComponent } from '@vue-mini/core';
import { storeToRefs } from 'pinia-vue-mini';

defineComponent(() => {
  const store = storeToRefs(useTestStore())
  const store2 = useTestStore()
  return {
    ...store,
    increment: store2.increment,
  };
});
