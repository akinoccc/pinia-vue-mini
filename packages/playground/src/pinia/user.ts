import { ref } from "@vue-mini/core";
import { defineStore } from "./src/store";

export const useUserStore = defineStore("user", () => {
  const name = ref("666");
  const age = ref(0);

  return { name, age };
});
