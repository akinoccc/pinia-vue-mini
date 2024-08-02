import { createApp } from "@vue-mini/core";
import { createPinia } from "pinia-vue-mini";

createApp(() => {
  console.log("App Launched!");
  const pinia = createPinia();

  return {
    pinia
  }
});
