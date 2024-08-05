import { ref } from "@vue-mini/core";
import { defineStore } from "pinia-vue-mini";

export const useUserOptionsStore = defineStore('user2', {
  state: () => ({
    age: 18
  })
})

export const useUserStore = defineStore("user", () => {
  const name = ref("666");
  const age = ref(0);

  const addAge = () => {
    age.value++;
    console.log(age.value)
  };

  return { name, age, addAge };
});
