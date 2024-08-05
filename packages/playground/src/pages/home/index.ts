import { useUserOptionsStore, useUserStore } from "@/store/user";
import { computed, definePage, reactive, ref, watch } from "@vue-mini/core";

definePage(() => {
  const greeting = ref("欢迎使用 Vue Mini");

  let userStore = useUserStore();
  const optionsStore = useUserOptionsStore()

  function addAge2() {
    console.log(optionsStore.age)
    test.age += 1
    optionsStore.age += 1
  }

  watch(() => optionsStore.age, (newValue, oldValue) => {
    console.log(newValue, oldValue)
  })

  const test = reactive({
    age: 4
  })
  // const age2 = computed(() => optionsStore.age)
  const age4 = computed(() => test.age)
  console.log(11, optionsStore)
  return {
    // pinia,
    greeting,
    // name,
    // store: optionsStore,
    age: userStore.age,
    age2: optionsStore.age,
    age3: test.age,
    age4,
    addAge: userStore.addAge,
    addAge2,
  };
});
