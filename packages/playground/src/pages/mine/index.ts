import { useUserStore } from "@/pinia/user";
import { defineComponent, ref } from "@vue-mini/core";

defineComponent(() => {
  const greeting = ref("希望你会喜欢");
  const { name, age } = useUserStore();
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
