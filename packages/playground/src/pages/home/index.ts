import { useUserOptionsStore, useUserStore } from "@/store/user";
import { computed, inject, isReactive, reactive, toRefs, watch } from "@vue-mini/core";
import { defineComponent, ref } from "@vue-mini/core";

defineComponent(() => {
  const greeting = ref("欢迎使用 Vue Mini");

  // const { name, age } = useUserStore();
  const optionsStore = useUserOptionsStore()

  // function addAge() {
  //   console.log(age);
  //   age.value++;
  // }
  const tt = reactive({
    age: 99
  })
  function addAge2() {
    // optionStore.addAge();
    // optionStore.addAge()
    // console.log(isReactive(optionStore))
    optionsStore.age.value += 1
    console.log('addAge', optionsStore);
    tt.age++
  }
  watch(() => optionsStore.age, (v) => {
    console.log('updated: ', v)
  }, {deep: true})
  watch(() => tt.age, (v) => {
    // console.log(pinia)
    console.log('updated: ', v)
  }, {deep: true})
  // console.log(optionStore, tt)
  const age2 = computed(() => optionsStore.age)
  const {pinia} = getApp()
  console.log(pinia)
  watch(() => pinia._state.get('user2'), (v) => console.log('ppp:', v))
  return {
    // pinia,
    greeting,
    // name,
    // age,
    age2,
    // addAge,
    addAge2,
  };
});
