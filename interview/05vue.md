---
sidebar_position: 6
title: vue面试题
---

## 谈谈你对 vue 的理解 ？

Vue 是一套用于构建用户界面的渐进式框架，Vue 的核心库只关注视图层

- 声明式框架
- MVVM 模式响应式数据绑定
- 虚拟 DOM（它能够在内存中构建虚拟 DOM 树，通过比较虚拟 DOM 的差异来最小化实际 DOM 的操作，提升性能。）
- 指令和插件系统

## Vue 为什么需要虚拟 DOM?

- 真实 DOM 的抽象 ， 减少了对真实 DOM 的操作
- 跨平台
- 如何生成的 template-》 render-》 返回虚拟 dom | h-》 createVNode

## 谈一谈对 Vue 组件化的理解？

- 高内聚、可重用、可组合
- 降低更新范围，只重新渲染变化的组件；
- 每个组件都有一个渲染函数 effect 数据变化就就会执行 合理拆分

## 你知道哪些 Vue3 新特性?

- Composition API
- setup 语法
- Teleport 传送门
- Fragments
- Emits Component Option （vue2 需要用.native， vue3 直接绑定到了根元素上）
- createRenderer 提供自定义渲染器
- v-bind in `<style>`
- 在作用域样式中可以包含全局规则或只针对插槽内容的规则 `:deep(h1)` `:global(.root)` `:slotted(.child)`
- Suspense

## Vue3 对⽐ Vue2 的变化

- 性能优化（更快）

  - Proxy defineProperty 递归 $set $delets
  - 模板编译优化
  - diff PatchFlag

- 体积优化（更小）

  - Vue3 移除了不常用的 API

    - $on $once .sync 过滤器 全局 API

  - Tree-shaking 机制实现按需引入

- 支持自定义渲染器 跨平台 以前需要改源码
- TypeScript 支持
- monorepo

## Composition API 和 Options API

- 反复横跳
- 无 this 问题
- Tree-shaking 支持友好
- 组件复用 Vue2 采用 mixins

## 请说一下你对响应式数据的理解？

- Vue2 defineProperty 数据劫持 重写 getter 和 setter 得递归 删除新增需要通过$set和$delete 不支持 Map 和 Set
- Vue3 采用 Proxy

## 双向绑定的理解，以及它的实现原理吗？

- 它用于将模型数据和视图数据进行同步，使得当模型数据发生变化时，视图会自动更新；当视图数据发生变化时，模型数据也会自动更新。双向绑定在表单处理、实时数据显示等方面提供了极大的便利性。
- 响应式系统（Reactivity System）：
  Vue 3 使用 Proxy 代替了 Vue 2 中的 Object.defineProperty，从而劫持对象的读写操作。Proxy 更强大，可以劫持对对象的动态添加和删除属性的操作。

- 依赖收集（Dependency Tracking）：
  Vue 3 使用 effect 函数来收集依赖。当一个响应式对象的属性被访问时，当前活跃的 effect 函数会被记录为该属性的依赖者。当该属性发生变化时，这些依赖者会被重新执行，从而更新视图。

- 模板编译（Template Compilation）：
  Vue 3 中，模板被编译成渲染函数。渲染函数在执行过程中会触发响应式数据的读取操作，从而完成依赖收集。当响应式数据变化时，渲染函数会重新执行，更新视图。

- 指令（Directives）：
  Vue 3 中使用 v-model 指令实现双向绑定。v-model 本质上是对 input 和 change 事件和绑定属性（如 value）的封装，用来实现数据和视图的双向同步。

## 生命周期对比

| 生命周期 v2   | 生命周期 v3             | 描述                                     |
| :------------ | :---------------------- | :--------------------------------------- |
| beforeCreate  | beforeCreate            | 组件实例被创建之初                       |
| created       | created                 | 组件实例已经完全创建                     |
| beforeMount   | beforeMount             | 组件挂载之前                             |
| mounted       | mounted                 | 组件挂载到实例上去之后                   |
| beforeUpdate  | beforeUpdate            | 组件数据发生变化，更新之前               |
| updated       | updated                 | 数据数据更新之后                         |
| beforeDestroy | **beforeUnmount**       | 组件实例销毁之前                         |
| destroyed     | **unmounted**           | 组件实例销毁之后                         |
| activated     | activated               | keep-alive 缓存的组件激活时              |
| deactivated   | deactivated             | keep-alive 缓存的组件停用时调用          |
| errorCaptured | errorCaptured           | 捕获一个来自子孙组件的错误时被调用       |
| -             | **renderTracked Dev**   | 调试钩子，响应式依赖被收集时调用         |
| -             | **renderTriggered Dev** | 调试钩子，响应式依赖被触发时调用         |
| -             | **serverPrefetch**      | ssr only，组件实例在服务器上被渲染前调用 |

> Vue3 中新增了，组合式 API：生命周期钩子，但是不存在 onBeforeCreate 和 onCreated 钩子

## 如何理解 reactive、ref 、toRef 和 toRefs？

- **reactive:**：将一个普通对象转换为响应式对象。(采用 new Proxy 进行实现) 通过代理对象访问属性时会进行依赖收集，属性更新时会触发依赖更新。
- **ref:** 创建一个包装对象（Wrapper Object）将一个简单的值包装成一个响应式对象，当访问`value`属性时会进行依赖收集，更新`value`属性时会触发依赖更新。(采用类访问器实现) _内部是对象的情况会采用 reactive 来进行处理_
- **toRef:**：创建`ref`对象，引用`reactive`中的属性。
- **toRefs:**：批量创建`ref`对象，引用`reactive`中的属性。

## watch 和 watchEffect 的区别？

- watchEffect 立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。
- watch 侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数。
- 底层都是基于 effect 函数实现 接受一个 getter 函数和 scheduler 依赖收集和触发更新

## computed 和 watch 区别?

> 底层都是基于 effect 实现

**用途**：

- `computed` 用于声明计算属性，主要用于基于数据计算出新的值。
- `watch` 用于监听数据变化，适合执行副作用操作。

**性能**：

- `computed` 会缓存计算结果，只有在依赖的数据发生变化时才会重新计算。
- `watch` 每次数据变化都会触发回调函数，执行逻辑可能较为昂贵。

**使用场景**：

- 使用 `computed` 当你需要基于响应式数据计算某个值时。
- 使用 `watch` 当你需要在数据变化时执行异步操作或副作用时。

**响应式依赖**：

- `computed` 自动追踪依赖，只有在依赖变化时重新计算。
- `watch` 手动指定要监听的响应式数据。

## Vue 中如何进行依赖收集

- Vue3 中会通过 Map 结构将属性和 effect 映射起来。
- 默认在初始化时会调用 render 函数，此时会触发属性依赖收集 track，
- 当属性发生修改时会找到对应的 effect 列表依次执行 trigger

## Vue 中如何检测数组变化?

Vue2 中重写数组方法
Vue3 Proxy 实现了更高效和精确的数组变化检测 但是由于代理问题 也对部分数组进行重写

## Vue 中 diff 算法原理

vue 基于虚拟 DOM 做更新 。diff 的核心就是比较两个虚拟节点的差异 。Vue 的 diff 算法是平级比较，不考虑跨级比较的情况。内部采用深度递归的方式 + 双指针的方式进行比较。

- 比较 key 和 type 是否能复用
- 看新老节点的类型
- 都是数组 然后核心比较
- 头头
- 尾尾
- 特殊情况的挂载
- 特殊情况的卸载
- 没比较完 最长递归子序列 移动老节点最少情况

## 谈谈 Vue3 中模板编译做了哪些优化？

- PatchFlags 优化 靶向更新
- BlockTree
- 静态提升
  每次调用 render 函数都要重新创建虚拟节点。
  静态提升则是将静态的节点或者属性提升出去。静态提升是以树为单位。也就是说树中节点有动态的不会进行提升。
- 预字符串化
  静态提升的节点都是静态的，我们可以将提升出来的节点字符串化。 当连续静态节点超过 20 个时，会将静态节点序列化为字符串。
- 缓存函数
  每次调用 render 的时都要创建新函数 开启函数缓存后,函数会被缓存起来，后续可以直接使用

## 如何将 template 转换成 render 函数 ?

1. 将 template 模板转换成 ast 语法树 - parserHTML
2. Vue2 对静态语法做静态标记 - optimize / Vue3 对 ast 语法进行转化 - transform
3. 重新生成代码 - codeGen

## v-if & v-show

v-if 如果条件不成立不会渲染当前指令所在节点的 dom 元素
v-show 只是切换当前 dom 的显示或者隐藏 display、opacity、visiviblity

- v-if 可以阻断内部代码是否执行

## v-if & v-for 优先级

- 在 Vue2 中解析时，先解析 v-for 在解析 v-if。会导致先循环后在对每一项进行判断，浪费性能。
- 在 Vue3 中 v-if 的优先级高于 v-for。
- 计算属性在 v-for 循环外部过滤数组

## Vue.use 是干什么的？

- 安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入,这样插件中就不在需要依赖 Vue 了。(扩展应用的功能)
- 添加全局指令、全局过滤器(Vue3 不再支持过滤器)、全局组件。

```js
Vue.use = function (plugin: Function | Object) {
  // 插件缓存
  const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
  if (installedPlugins.indexOf(plugin) > -1) {
    // 如果已经有插件 直接返回
    return this
  }
  // additional parameters
  const args = toArray(arguments, 1) // 除了第一项其他的参数整合成数组
  args.unshift(this) // 将Vue 放入到数组中
  if (typeof plugin.install === "function") {
    // 调用install方法
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === "function") {
    // 直接调用方法
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin) // 缓存插件
  return this
}
```

## 说说你对 nextTick 的理解？

- 当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

```js
const resolvedPromise = Promise.resolve()
let currentFlushPromise
export function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

**vue2**

- [渲染 watcher， nextTick 逻辑，数据更新] 页面要等同步代码执行完才执行下一个 tick
- 比如说我先写 nextTick 然后修改数据更新页面 我在之前的 nextTick 中是会获取不到最新的数据的 因为先执行的 nextTick 然后修改的页面
  优雅降级（Promise、MutationObserver、setImmediate、setTimeout） 这里一般会配合浏览器事件环作为面试题。

**vue3**

- 当执行 mounted 之前会创建一个 promise,nextTick 会被延迟到这个 promise 之后执行 (值被改为 100 后再进行渲染)
- 比如说我先写 nextTick 然后修改数据更新页面 我在之前的 nextTick 此时 DOM 已经更新 是可以获取到数据的

## Vue 中如何进行组件通信？

props 父子间通信
$attrs 父子间通信
$emit 子父通信
expose / ref / $parent 实例通信
v-model 数据同步
provide / inject 跨级通信
slot ui 通信
Vuex/pinia 状态管理
mitt 发布订阅通信（事件总线）

## Vue-Router 有几种钩子函数，具体是什么及执行流程是怎样的?

1. beforeRouteLeave
2. beforeEach
3. BeforeEnter
4. BeforeRouteEnter
5. BeforeResolve
   导航确认
6. afterEach‘
   页面更新
7. BeforeRouteEnter 里面的 next 函数 参数为组件的实例

导航被触发。
在失活的组件里调用 beforeRouteLeave 守卫。
调用全局的 beforeEach 守卫。
在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
在路由配置里调用 beforeEnter。
解析异步路由组件。
在被激活的组件里调用 beforeRouteEnter。
调用全局的 beforeResolve 守卫(2.5+)。
导航被确认。
调用全局的 afterEach 钩子。
触发 DOM 更新。
调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
