import { useUserStore } from "@/pinia/user";
import { defineComponent, ref } from "@vue-mini/core";

defineComponent(() => {
  const greeting = ref("欢迎使用 Vue Mini");

  const { name, age } = useUserStore();

  console.log(greeting, useUserStore().age);
  function addAge() {
    console.log(age);
    age.value++;
  }

  return {
    greeting,
    name,
    age,
    addAge,
  };
});
