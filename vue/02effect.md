---
title: 2、ReactiveEffect方法的实现
author: 高红翔
tags:
  - Vue.js
---

## 1.用途

> 底层 API，响应式中的 computed 和 watch 都是基于这个实现的

## 2.编写 effect 函数

```ts
export let activeEffect = undefined // 当前正在执行的effect

class ReactiveEffect {
  active = true
  deps = [] // 收集effect中使用到的属性
  constructor(public fn, public scheduler) {}

  run() {
    if (!this.active) {
      // 不是激活状态
      return this.fn()
    }
    let lastEffect = activeEffect // 用于构建当前激活的effect
    try {
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }
}
export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  }) // 创建响应式effect
  _effect.run() // 让响应式effect默认执行
}
```

## 3.依赖收集

> 默认执行`effect`时会对属性，进行依赖收集

```ts
get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
    }
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key);  // 依赖收集
    return res;
}
```

## 4.track 方法实现

**reactiveEffect.ts**

```ts
const targetMap = new WeakMap() // 记录依赖关系
export const createDep = (cleanup, key) => {
  const dep = new Map() as any
  dep.cleanup = cleanup // 给清理依赖埋下伏笔
  dep.name = key
  return dep
}

export function track(target, type, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target) // {对象：map({})}
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      // {对象：{ 属性 :{ effect, effect }}}
      depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key)))
    }
    trackEffect(activeEffect, dep)
  }
}
```

> 将属性和对应的 effect 维护成映射关系，后续属性变化可以触发对应的 effect 函数重新`run`

**effect.ts**

```ts
class ReactiveEffect {
  _depsLength = 0 // 用于记录依赖的个数
  _trackId = 0 // 用于记录收集的次数
  deps = []
  // ...
}
export function trackEffect(effect, dep) {
  // 属性记住effect
  dep.set(effect, effect._trackId)
  // effect记住依赖
  effect.deps[effect._depsLength++] = dep
}
```

## 5.触发更新

```ts
set(target, key, value, receiver) {
    // 等会赋值的时候可以重新触发effect执行
    let oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
        trigger(target, key, value, oldValue);
    }
    return result;
}
```

**reactiveEffect.ts**

```ts
export function trigger(target, key?, newValue?, oldValue?) {
  // 通过对象找到属性对应的映射表
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  // 通过属性找到 effecMap
  let dep = depsMap.get(key)
  if (dep) {
    triggerEffects(dep)
  }
}
```

**effect.ts**

```ts
export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler()
    }
  }
}
```

## 6.分支切换与`cleanup`

在渲染时我们要避免副作用函数产生的遗留

```ts
const state = reactive({ flag: true, name: "zs", age: 30 })
effect(() => {
  // 副作用函数 (effect执行渲染了页面)
  console.log("render")
  document.body.innerHTML = state.flag ? state.name : state.age
})
setTimeout(() => {
  state.flag = false
  setTimeout(() => {
    console.log("修改name，原则上不更新")
    state.name = "zs"
  }, 1000)
}, 1000)
```

```ts
export class ReactiveEffect {
  // ...
  run() {
    // ...
    try {
      activeEffect = this
      preCleanupEffect(this) // 每次渲染前重新进行依赖收集
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }
}
```

```ts
function preCleanupEffect(effect) {
  // 执行函数前先进行清理操作
  effect._trackId++
  effect._depsLength = 0
}
```

> 重新进行依赖收集时，需要做比对

```ts
export function trackEffect(effect, dep) {
  // 如果一个属性多次收集，需要排除
  if (dep.get(effect) !== effect._trackId) {
    // 更新id
    dep.set(effect, effect._trackId)
    //  获取上次的依赖，比对是否有变化
    const oldDep = effect.deps[effect._depsLength]
    // {flag, name} 1
    // {flag, age}  2
    // 如果有变化，需要清理以前的，并且塞入新的
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect)
      }
      // 记录effect对应的依赖
      effect.deps[effect._depsLength++] = dep
    } else {
      effect._depsLength++
    }
  }
}
```

> 删除掉收集器中对应的 effect

```ts
function cleanupDepEffect(dep, effect) {
  dep.delete(effect)
  if (dep.size === 0) {
    dep.cleanup() // 清理此属性
  }
}
```

> 销毁多于的依赖

```ts
try {
  activeEffect = this
  preCleanupEffect(this) // 每次渲染前重新进行依赖收集
  return this.fn()
} finally {
  postCleanupEffect(this) // 清理依赖
  activeEffect = lastEffect
}
function postCleanupEffect(effect) {
  // 重新做收集后，看依赖列表有没有增加，有增加就要删除 （map是不能添加重复的）
  if (effect.deps.length > effect._depsLength) {
    // 仅处理多出来的删除即可
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      cleanupDepEffect(effect.deps[i], effect)
    }
    effect.deps.length = effect._depsLength
  }
}
```

## 7.调度执行

`trigger`触发时，我们可以自己决定副作用函数执行的时机、次数、及执行方式

```ts
export function effect(fn, options?) {
  // 创建一个响应式effect 数据变化后可以重新执行

  // 创建一个effect，只要依赖的属性变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()

  if (options) {
    // 合并参数
    Object.assign(_effect, options)
  }
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner // 返回run方法
}
```

## 8.防止递归调用

> 通过 running 属性防止递归调用

```ts
run() {
  if (!this.active) {
    // 不是激活状态
    return this.fn();
  }
  let lastEffect = activeEffect; // 用于构建当前激活的effect
  try {
    activeEffect = this;
    this._runnings++;
    preCleanupEffect(this); // 累计重新收集
    return this.fn();
  } finally {
    postCleanupEffect(this);
    this._runnings--;
    activeEffect = lastEffect;
  }
}
```

## 9.深度代理[#]

```ts
 get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
    }
    // 等会谁来取值就做依赖收集
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key);

    if(isObject(res)){
        return reactive(res);
    }
    return res;
}
```

> 当取值时返回的值是对象，则返回这个对象的代理对象，从而实现深度代理
