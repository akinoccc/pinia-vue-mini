import { computed, ref } from "@vue-mini/core";
import { defineStore } from "pinia-vue-mini";

export const useTestStore = defineStore("test", () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => {
    console.log(count.value)
    count.value++
  }

  return {
    aaa: 1,
    count,
    doubleCount,
    increment
  }
}, {
  persist: true
})
