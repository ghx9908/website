---
title: promise链式调用的实现原理
last_update:
  date: 01/01/2023
  author: 高红翔
---

# promisify 的实现

## 将某一个基于回调的函数变为 Primise 可链式调用

- 封装将 node 中的 fs.readFile

```js
function readFile(filepath) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf8", function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
  return promise
}
```

## 封装通用的 promisify

```js
function promisify(fn) {
  // fn = fs.readFile
  return function (...args) {
    // readFile  剩余运算符
    let promise = new Promise((resolve, reject) => {
      // 可以将node中的异步api转换成promise的形式 （error-first）
      fn(...args, function (err, data) {
        // 展开运算符
        if (err) return reject(err)
        resolve(data)
      })
    })
    return promise
  }
}
//使用
let readFile = promisify(fs.readFile) // 高阶函数的概念
```

# Promise.then 的实现

## then 链的特点

1. 当 then 中成功和失败的回调函数返回的是一个 promise。 内部会解析这个 promise。并且将结果传递到外层的下一个 then 中
2. 下一次 then 走成功还是失败，取决于当前 promise 的状态
3. 如果成功和失败返回不是一个 promise， 那么这个结果会直接传递到下一个 then 的成功
4. 如果成功和失败的回调中抛出异常了 则会执行下一个 then 的失败

```js
readFile(path.resolve(__dirname, "a.txt"), "utf8")
  .then((data) => {
    return readFile(data, "utf8") // 返回的promise是成功则走到下一个成功,如果是失败则走到下一个人的失败
  })
  .then(
    (data) => {
      console.log(data, "success")
    },
    (err) => {
      console.log(err, "fail")
      return true
    }
  )
  .then((data) => {
    console.log(data, "success")
    throw new Error("出错")
  })
  .then(
    () => {},
    (err) => {
      console.log(err)
    }
  )
```

## 实现

```js
// 为了所有人promise 可以互相调用，所以所有的promise都要遵循这个规则
function resolvePromise(promise2, x, resolve, reject) {
  // 这个方法处理的会严谨一些，保证所有人的promise 都可以互相调用

  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  // 如果x 和 promise2 引用的是同一个对象，那么promise2 要等待x执行完毕
  // x是一个promise，而且永远不会成功和失败，那么就会在这里等待
  if (x === promise2)
    return reject(new TypeError("Chaining cycle detected for promise"))

  // 我如何知道x是不是promise
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise
    // Let then be x.then
    let called = false
    try {
      let then = x.then // then方法可能是通过defineProperty来进行定义的
      if (typeof then === "function") {
        // 是promise  {then:function(){}}
        then.call(
          x,
          (y) => {
            // x.then
            // 为了防止promise解析后的结果依旧是promise，所以需要递归解析
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 就是一个对象或者函数  {a:1}  function(){}
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x) // 普通值 直接将结果传递到下面就可以了
  }
}
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
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e
          }
    /
    let promise2 = new Promise((resolve, reject) => {
      // 调用then的时候 已经确定了是成功还是失败了
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promise2
  }
}
```
