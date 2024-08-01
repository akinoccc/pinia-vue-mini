import { createApp } from "@vue-mini/core";
import { createPinia } from "./pinia/src/createPinia";

createApp(() => {
  console.log("App Launched!");
  createPinia();
});
