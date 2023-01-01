---
title: promise基本实现
last_update:
  date: 01/01/2023
  author: 高红翔
---

# promise 干什么的，解决的问题是什么？

- 回调写起来不好看(难以维护) 恶魔金字塔 嵌套逻辑不优雅 (链式调用 then)
- 错误处理无法统一 我们需要处理公共的错误逻辑 (catch)
- 尽量简化回调 多个异步并发问题 （Promise.all Promise.finllay）

## 基本实现

- promise 是一个构造函数，默认需要传入一个 executor 执行器
- executor 会立刻执行，并且传入 resolve 和 reject 两个参数
- promise 有三个状态 fulfilled 成功 reject 拒绝态 pending 等待态 (默认是等待态)
- 每个 promise 都有一个 then 方法 ， 可以访问到成功的值和失败的原因
- 可以通过 resolve 和 reject 来改变状态，同时调用对应的回调， 一个 promise 实例状态变化后，不能再重新的发生变化
- 或者当 executor 发生异常的时候 也会触发 promise 的失败

### 代码

```js
// promise.js
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
class Promise {
  constructor(executor) {
    this.status = PENDING // 默认是等待态
    this.value = undefined /// 成功的原因
    this.reason = undefined // 失败的原因

    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    // promise调用then的时候 可能状态依旧是pending，那么我们需要将回调先存放起来
    // 等待过一会调用resolve时触发 onResolvedCallbacks 执行
    // 等待调用 reject时触发onRejectedCallbacks 执行

    const resolve = (value) => {
      //只有状态是pending的时候 才可以修改状态 和 改变成功和失败的原因
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        // 成功调用成功的回调
        this.onResolvedCallbacks.forEach((cb) => cb())
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        // 失败调用成功的回调
        this.onRejectedCallbacks.forEach((cb) => cb())
      }
    }
    //  调用executor 会自动传入 resolve 和 reject
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // 调用then的时候 已经确定了是成功还是失败了
    if (this.status === FULFILLED) {
      // TODO..
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      // TODO..
      onRejected(this.reason)
    }
    if (this.status === PENDING) {
      this.onResolvedCallbacks.push(() => {
        // TODO..
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        // TODO..
        onRejected(this.reason)
      })
    }
  }
}

module.exports = Promise
// 模块化规范 ， commonjs规范
```

### 测试

```js
const Promise = require("./promise")
const promise = new Promise((resolve, reject) => {
  // throw new Error('出错了')
  //resolve('ok'); // resolve 和 reject可以更改promise 的状态
  //reject('ok');
  setTimeout(() => {
    reject("ok")
  }, 1000)
})
promise.then(
  (data) => {
    console.log(data, "success1")
  },
  (reason) => {
    console.log(reason, "fail")
  }
)
promise.then(
  (data) => {
    console.log(data, "success2")
  },
  (reason) => {
    console.log(reason, "fail")
  }
)
```
