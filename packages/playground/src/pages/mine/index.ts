import { useUserOptionsStore, useUserStore } from '@/store/user'
import { defineComponent, ref } from '@vue-mini/core'

defineComponent(() => {
  const greeting = ref('希望你会喜欢')
  const { name, age } = useUserStore()
  function addAge() {
    console.log(age)
    age.value++
  }

  const o2 = useUserOptionsStore()

  return {
    greeting,
    name,
    age,
    age2: o2.age,
    addAge,
  }
})
