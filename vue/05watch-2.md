---
title: 5、watch & WatchEffect源码解读
tags:
  - Vue.js
---

> 我们之前使用的 watch 函数是和 Vue 组件以及生命周期一起实现的，他们是深度绑定的，所以 watch 函数代码的位置在 vue 源码中的 runtime-core 模块中。
> 在 3.5 版本中重构了一个 base watch 函数，这个函数的实现和 vue 组件没有一毛钱关系，所以他是在 reactivity 模块中。

## 一、`watch` 与 `watchEffect`

`watch` 和 `watchEffect` 是 Vue 3 的两个核心 API，帮助我们监听和追踪响应式数据的变化。它们的实现基于 Vue 内部的响应式系统，通过依赖收集机制追踪数据的变化。其背后的实现依赖 Vue 内部的 `ReactiveEffect` 类，通过它创建副作用函数。

### 1.1 `watch` 和 `watchEffect` 的区别

- **`watch`** 需要显式声明监听的目标，以及变化后的回调函数
  - **场景**：需要对某个具体的变量或一组变量进行响应式监听，特别是在需要执行一些副作用的场景下，比如调用接口、更新其他状态等。
- **`watchEffect`** 则自动收集依赖，触发变化时自动运行函数，不需要手动指定回调。
  - **场景**：适合简单的副作用处理，当不确定具体依赖时可以使用 `watchEffect`，自动追踪响应式数据依赖并响应变化。

### 1.2 watchEffect

```js
export function watchEffect(effect: WatchEffect, options?: WatchEffectOptions): WatchHandle {
  return doWatch(effect, null, options)
}
```

### 1.3 watch

```js
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchHandle {
  return doWatch(source as any, cb, options)
}
```

### 1.4 doWatch

> **生成 watchHandle**：调用 `baseWatch` 创建监听器，并返回 `watchHandle`，其中包含停止、恢复和暂停功能。

```js
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ
): WatchHandle {
  const { immediate, deep, flush, once } = options
  const baseWatchOptions: BaseWatchOptions = extend({}, options)

  // 调度器设置
  baseWatchOptions.scheduler = (job, isFirstRun) => {
    if (isFirstRun) {
      job()
    } else {
      queueJob(job)
    }
  }

  // 执行 watch 行为
  const watchHandle = baseWatch(source, cb, baseWatchOptions)
  return watchHandle
}
```

## 二、`watch` 的核心逻辑

`watch` 的实现依赖于 `ReactiveEffect`，其核心是创建 `effect`，并根据是否传入回调函数来决定执行方式。

### 2.1 `watch` 核心逻辑

```ts
export function watch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb?: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ
): WatchHandle {
  const { immediate, deep, once, scheduler } = options
  let effect: ReactiveEffect

  const scope = getCurrentScope()
  const watchHandle: WatchHandle = () => {
    effect.stop()
    if (scope) {
      remove(scope.effects, effect)
    }
  }

  // 核心：创建 ReactiveEffect 实例
  effect = new ReactiveEffect(getter)
  effect.scheduler = scheduler ? () => scheduler(job, false) : (job as EffectScheduler)

  watchHandle.pause = effect.pause.bind(effect)
  watchHandle.resume = effect.resume.bind(effect)
  watchHandle.stop = watchHandle

  return watchHandle
}
```

### 2.2 `getter` 函数

`getter` 是 `watch` 的核心部分，负责根据监听的 `source` 来获取值。在 `watch` 的不同场景中（`Ref`、`Reactive` 对象、`数组`等），`getter` 的处理逻辑会有所不同：

```ts
let getter: () => any

if (isRef(source)) {
  getter = () => source.value // 如果是Ref，则获取其value
  forceTrigger = isShallow(source)
} else if (isReactive(source)) {
  getter = () => reactiveGetter(source) // 如果是Reactive对象，使用 reactiveGetter
  forceTrigger = true
} else if (isArray(source)) {
  isMultiSource = true
  forceTrigger = source.some((s) => isReactive(s) || isShallow(s))
  getter = () =>
    source.map((s) => {
      // 如果是数组，遍历处理每个source
      if (isRef(s)) {
        return s.value
      } else if (isReactive(s)) {
        return reactiveGetter(s)
      } else if (isFunction(s)) {
        return s()
      }
    })
} else if (isFunction(source)) {
  if (cb) {
    getter = source as () => any // 如果是回调函数，直接执行
  } else {
    getter = () => {
      // watchEffect 无回调时的处理逻辑
      if (cleanup) {
        pauseTracking()
        try {
          cleanup()
        } finally {
          resetTracking()
        }
      }
      const currentEffect = activeWatcher
      activeWatcher = effect
      try {
        source(boundCleanup) // 运行 source 函数
      } finally {
        activeWatcher = currentEffect
      }
    }
  }
} else {
  getter = () => {}
}
if (cb && deep) {
  const baseGetter = getter
  const depth = deep === true ? Infinity : deep
  getter = () => traverse(baseGetter(), depth)
}
```

> `traverse` 是 Vue 内部用于对对象进行深度遍历的工具函数，它用于处理深度监听的情况。在处理复杂嵌套对象时，通过深度遍历来收集依赖。

- 对于 `Ref`，会递归遍历其 `.value`。
- 对于 `Array`，会递归遍历数组的每个元素。
- 对于 `Set` 或 `Map`，则会遍历每个元素。
- 对于 `PlainObject`，遍历所有自有属性及 `Symbol` 属性。
- 通过 `seen` 记录已遍历的对象，避免循环引用导致的死循环。

```ts
export function traverse(value: unknown, depth: number = Infinity, seen?: Set<unknown>): unknown {
  if (depth <= 0 || !isObject(value) || (value as any)[ReactiveFlags.SKIP]) {
    return value
  }
  seen = seen || new Set()
  if (seen.has(value)) {
    return value
  }
  seen.add(value)
  depth--

  if (isRef(value)) {
    traverse(value.value, depth, seen)
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen)
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, depth, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen)
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key as any], depth, seen)
      }
    }
  }
  return value
}
```

### 2.3、`scheduler` 调度器

`scheduler` 是 Vue 内部用于控制副作用函数执行时机的机制，它允许开发者自定义 `watch` 函数的触发方式。`watch` 在创建 `ReactiveEffect` 时，会通过 `scheduler` 来调度 `job` 执行：

```ts
const job = () => {
  if (cb) {
    const newValue = effect.run() // 运行副作用函数获取新值
    if (cleanup) {
      cleanup() // 执行清理函数
    }
    const currentWatcher = activeWatcher
    activeWatcher = effect
    try {
      const args = [newValue, oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, boundCleanup]
      cb!(...args) // 执行回调函数
      oldValue = newValue
    } finally {
      activeWatcher = currentWatcher
    }
  } else {
    effect.run() // watchEffect 直接运行副作用
  }
}

effect = new ReactiveEffect(getter) // 创建 ReactiveEffect 实例
effect.scheduler = scheduler ? () => scheduler(job, false) : (job as EffectScheduler)
```

### 2.4 深度监听处理

如果 `watch` 配置了 `deep: true`，则需要对监听的对象进行深度遍历。`getter` 会调用 `traverse` 方法来遍历对象属性，以便收集依赖：

```ts
if (cb && deep) {
  const baseGetter = getter
  const depth = deep === true ? Infinity : deep
  getter = () => traverse(baseGetter(), depth) // 对 getter 获取的对象进行深度遍历
}
```

### 2.5 初始运行

在 `watch` 中，如果设置了 `immediate` 选项，则会立即执行回调函数，否则会先获取旧值，然后在监听对象发生变化时触发：

```ts
// 初始运行
if (cb) {
  if (immediate) {
    job() // 立即执行 job
  } else {
    oldValue = effect.run() // 获取初始值
  }
} else {
  effect.run() // 无回调时仅运行 effect
}
```

### 2.6 执行一次

**`immediate` 选项**：当设置为 `true` 时，`watch` 会立即执行一次回调函数，而无需等待响应式数据的变化。

```ts
if (once) {
  if (cb) {
    const _cb = cb
    cb = (...args) => {
      _cb(...args)
      watchHandle() // 执行完一次后停止
    }
  } else {
    const _getter = getter
    getter = () => {
      _getter()
      watchHandle() // 执行完一次后停止
    }
  }
}
```

### 2.7 清理函数 `cleanup`

在每次副作用执行之前，Vue 会先执行 `cleanup` 函数，用于清理上一次副作用执行时的副作用，例如事件监听、定时器等。`cleanup` 的注册通过 `onWatcherCleanup` 实现。

```ts
const job = () => {
  if (cleanup) {
    cleanup() // 执行上一次的清理函数
  }
  const newValue = effect.run()
  const args = [newValue, oldValue, boundCleanup]
  cb!(...args)
  oldValue = newValue
}

boundCleanup = (fn) => onWatcherCleanup(fn, false, effect) // 注册清理函数

cleanup = effect.onStop = () => {
  // 在 effect 停止时执行清理
  const cleanups = cleanupMap.get(effect)
  if (cleanups) {
    for (const cleanup of cleanups) cleanup()
    cleanupMap.delete(effect)
  }
}
```

**清理函数的流程**

1. **绑定清理函数**：在每次 `job` 执行之前，都会通过 `boundCleanup` 将清理函数注册到当前 `ReactiveEffect` 上。
2. **停止时清理**：当 `effect` 停止时，`onStop` 会触发，清除所有已注册的清理函数。

## 三、`onWatcherCleanup` 清理机制

当一个 `watch` 被停止或重新运行时，清理函数需要被执行。Vue 使用 `onWatcherCleanup` 来管理这些清理工作。其核心是 `WeakMap` 和 `ReactiveEffect` 的绑定。

### 3.1 `onWatcherCleanup` 源码解析

```ts
const cleanupMap: WeakMap<ReactiveEffect, (() => void)[]> = new WeakMap()
let activeWatcher: ReactiveEffect | undefined = undefined

export function onWatcherCleanup(
  cleanupFn: () => void,
  failSilently = false,
  owner: ReactiveEffect | undefined = activeWatcher
): void {
  if (owner) {
    let cleanups = cleanupMap.get(owner)
    if (!cleanups) cleanupMap.set(owner, (cleanups = []))
    cleanups.push(cleanupFn)
  }
}
```

### 3.2 清理机制的工作原理

1. **保存清理函数**：每当有新的清理函数需要被注册时，会将其与当前活跃的 `ReactiveEffect` 绑定（通过 `activeWatcher` 来判断当前激活的 `effect`）。
2. **执行清理函数**：当 `effect` 停止时，系统会自动调用所有绑定的清理函数。
