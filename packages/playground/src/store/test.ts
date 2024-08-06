import {defineStore} from "pinia-vue-mini";
import {computed, ref} from "@vue-mini/core";

export const useTestStore = defineStore("test", () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => {
    count.value++
    console.log(count.value)
  }

  return {
    count,
    doubleCount,
    increment
  }
})
