---
title: 10、provide & inject
tags:
  - Vue.js
---

### 基本使用

```ts
const My = {
  setup() {
    const name = inject("name")
    return { name }
  },
  render() {
    return h("div", this.name)
  },
}
const VueComponent = {
  setup() {
    const state = reactive({ name: "mrs jiang" })
    provide("name", state.name)
    setTimeout(() => {
      state.name = "jw"
    }, 1000)
    return () => h(My)
  },
}
render(h(VueComponent), app)
```

> 在创建实例时会采用父组件的 provides 属性

我们需要先构建组件渲染的父子关系

```ts
const patch = (n1, n2, container, anchor = null, parentComponent = null) => {
  switch (type) {
    case Fragment: // 无用的标签
      processFragment(n1, n2, container, parentComponent)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, anchor, parentComponent)
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(n1, n2, container, anchor, parentComponent)
      }
  }
}
```

```ts
const processComponent = (n1, n2, container, anchor, parentComponent) => {
  if (n1 == null) {
    // 组件挂载的时候传入父组件
    mountComponent(n2, container, anchor, parentComponent)
  } else {
    // 组件更新靠的是props
    updateComponent(n1, n2)
  }
}
```

```ts
export function createComponentInstance(vnode, parent) {
  const instance = {
    // 组件的实例
    data: null,
    parent,
    provides: parent ? parent.provides : Object.create(null), // 创建一个provides对象
    // ... 创建实例的时候标记父组件是谁
  }
  return instance
}
```

### Provide

```ts
export function provide(key, value) {
  if (!currentInstance) return
  const parentProvides = currentInstance.parent && currentInstance.parent.provides
  let provides = currentInstance.provides // 获取当前实例的provides属性
  // 如果是同一个对象，就创建个新的，下次在调用provide不必重新创建
  // provides('a', 1);
  // provides('b', 2)
  if (parentProvides === provides) {
    provides = currentInstance.provides = Object.create(provides) // 创建一个新的provides来存储
  }
  provides[key] = value
}
```

### Inject

```ts
export function inject(key, defaultValue) {
  if (!currentInstance) return
  const provides = currentInstance.parent.provides
  if (provides && key in provides) {
    return provides[key]
  } else if (arguments.length > 1) {
    return defaultValue
  }
}
```
