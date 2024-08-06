import { defineComponent } from '@vue-mini/core';
import {useTestStore} from "@/store/test";

defineComponent(() => {
  const {count, doubleCount, increment} = useTestStore()
  console.log(count, doubleCount, increment)
  return {
    count,
    doubleCount,
    increment,
  };
});
