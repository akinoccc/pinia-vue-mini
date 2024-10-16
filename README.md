# pinia-vue-mini

另一个适配 [vue-mini](https://github.com/vue-mini/vue-mini) 的 Pinia。

> [!IMPORTANT]
> 项目当前处于 `Beta` 阶段

## 安装

```bash
npm i pinia-vue-mini
```

```bash
yarn add pinia-vue-mini
```

```bash
pnpm i pinia-vue-mini
```

## 使用

### 创建 Pinia 实例

```ts
// app.ts
import { createApp } from 'vue-mini'
import { createPinia } from 'pinia-vue-mini'

createApp(() => {
  createPinia()
});
```

### 定义 Store

> [!WARNING]
> `pinia-vue-mini` 仅支持 `setupStore`

```ts
// counter.ts
import { defineStore } from 'pinia-vue-mini'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { 
    count, 
    double, 
    increment 
  }
})
```

### 使用 Store

使用方式与 [Pinia](https://pinia.vuejs.org/) 基本一致

```ts
// page.ts
import { definePage } from 'vue-mini/core'
import { useCounterStore } from './store'

definePage(() => {
  const counter = useCounterStore()
  
  return {
    count: counter.count,
    double: counter.double,
    increment: counter.increment
  }
})
```

> [!WARNING]
> 和pinia一样，直接结构 store 会丢失响应式，如需要响应式，请使用 `storeToRefs` 或 使用 `.[prop name]` 的形式单独赋值返回

**以下用法会导致响应式丢失**

```ts
// page.ts
import { definePage } from 'vue-mini/core'
import { useCounterStore } from './store'

definePage(() => {
  const counter = useCounterStore()
  
  return {
    ...counter  
  }
})
```

**storeToRefs**

为了 store 可以解构使用，我们和 pinia 一样，提供了 `storeToRefs` 方法，该方法会返回一个引用对象，包含 store 的所有 state、 getter。类似于 toRefs()，所以 method 和非响应式属性会被完全忽略。

```ts
// page.ts
import { definePage } from 'vue-mini/core'
import { useCounterStore } from './store'

definePage(() => {
  const counter = useCounterStore()
  const { count, double } = storeToRefs(counter)
  
  return {
    count,
    double,
  }
})
```


