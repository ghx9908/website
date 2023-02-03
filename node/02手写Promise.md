---
title: 2. 手写Promise
last_update:
  date: 02/03/2023
  author: 高红翔
---

## **1.**什么是 Promise？

> Promise 是⼀种⽤于异步编程的 JavaScript 对象。主要⽤于处理异步操作的结果。

异步导致的问题：回调地狱（让代码难以阅读）、错误处理（⽆法统⼀处理错误）、多个异步操作（“同步结果”困难）

- Promise 可以使⽤.then()⽅法链式处理异步逻辑

- Promise 可以使⽤.catch()⽅法处理异步操作失败的情况

- Promise 提供.all()、.race()⽅法⽀持处理多个 Promise 对象的结果。

## **2.**⼿写 Promise

### **2.1 Promise**基础版本实现

1. 每个 promise 都有三个状态 pending 等待态 fulfilled 成功态 rejected 失败态。

2. 每个 promise 需要有⼀个 then ⽅法，.then()⽅法接受两个回调函数，⼀个是成功的回调另⼀个是失败的回调。

3. new Promise 中传递的函数会⽴即执⾏。

4. promise 对象的状态⼀旦更改后，即不能再改变。（⼀旦成功就不能失败，⼀旦失败就不能成功）。

5. 当 promise 抛出异常后，也会变为失败态。

```js
const Promise = require("./1.promise")
let promise = new Promise((resolve, reject) => {
  //默认pending状态
  // resolve 和 reject可以改变promise的状态，调⽤then的时候会检测状态来触发对应的函数
  throw new Error("error") // 在代码中发⽣异常也是会触发失败的情况
  resolve("success")
  reject("error")
})
promise.then(
  (value) => {
    // 成功的回调
    console.log("success", value)
  },
  (reason) => {
    // 失败的回调
    console.log("fail", reason)
  }
)
```

```js
// 1.promise默认三个状态
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
class Promise {
  constructor(executor) {
    // 2.⽤户传⼊⼀个
    executor
    this.status = PENDING
    this.value = undefined // 成功的值
    this.reason = undefined // 失败的原因
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
      }
    }
    try {
      executor(resolve, reject) // 3.这个代码执⾏的时候可能会发⽣异常
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // 4.调⽤then的时候来判断成功还是失败
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}
module.exports = Promise
```

### **2.2 Promise**异步情况处理

- 调⽤ then 时 promise 的状态可能还是等待态，此时会将成功的回调和失败的回调收集起来，等待状态变化时在调⽤对应的回调。 （订阅）

- 同⼀个 promise 对象多次调⽤ then ⽅法。当成功或失败的时候这些回调会按照注册顺序被依次执⾏。（发布）

```js
const Promise = require("./1.promise")
let promise = new Promise((resolve, reject) => {
  //默认pending状态
  setTimeout(() => {
    resolve("success") // 500ms后成功
  }, 500)
})
promise.then(
  (value) => {
    // 成功的回调
    console.log("success", value)
  },
  (reason) => {
    // 失败的回调
    console.log("fail", reason)
  }
)
promise.then(
  (value) => {
    // 成功的回调
    console.log("success", value)
  },
  (reason) => {
    // 失败的回调
    console.log("fail", reason)
  }
)
// success success
// success success
```

```js
class Promise {
  constructor(executor) {
    // ...
    this.onResolvedCallbacks = [] // 存放成功的回调
    this.onRejectedCallbacks = [] // 存放失败的回调
    const resolve = (value) => {
      if (this.status === PENDING) {
        // ...
        this.onResolvedCallbacks.forEach((fn) => fn()) //成功时调⽤
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        // ...
        this.onRejectedCallbacks.forEach((fn) => fn()) //失败时调⽤
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // ...
    if (this.status === PENDING) {
      // 等待态分别存⼊回调
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

### **2.3 Promise**链式调⽤

```js
const fs = require("fs")
const path = require("path")
fs.readFile(
  path.resolve(__dirname, "fileUrl.txt"),
  "utf-8",
  function (err, data) {
    if (err) {
      return console.log(err)
    }
    fs.readFile(path.resolve(__dirname, data), "utf-8", function (err, data) {
      if (err) {
        return console.log(err)
      }
      console.log(data) // 获取最终的结果
    })
  }
)
```

> 上⼀个异步输出的结果，是下⼀个的输⼊，会导致回调嵌套问题（回调地狱问题 、恶魔⾦⼦塔）

**解决⽅案采⽤ promise，将逻辑改变成链式调⽤**

promise 中的 then ⽅法可以传递两个参数 （成功和失败的回调），这两个⽅法都可以返回值。

- 返回的是 promise 对象，外层的下⼀次 then 会⽤这个 promise 的状态来决定⾛的是成功还是失败。

- 返回的是⼀个普通值的情况 （不是 promise） 就会执⾏下⼀次的成功 (会将返回的值向下传递)

- 如果抛出异常会执⾏外层下⼀次的 then 的失败。

```js
function readFile(utl) {
  return new Promise((resolve, reject) => {
    fs.readFile(utl, "utf-8", function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
readFile(path.resolve(__dirname, "fileUrl.txt"))
  .then((data) => {
    return readFile(path.resolve(__dirname, data))
  })
  .then((data) => {
    console.log(data) // 1
    return 123
  })
  .then((data) => {
    // 2
    console.log("success", data)
    throw new Error() // 3
  })
  .then(null, (err) => console.log(err))
```

> 总结：就是返回值决定下⼀次 then ⾛成功还是失败，promise 为了实现链式调⽤需要返回了⼀个全新的 promise，这⾥不能返回 this，因为同⼀个实例不能从成功变为失败。

```js
class Promise {
  // ...
  then(onFulfilled, onRejected) {
    // 不停的创建新的promise，来实现链式调⽤
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          // 为了保证promise2已经产⽣
          try {
            let x = onFulfilled(this.value)
            // ⽤x来决定promise2是执⾏成功还是失败
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            // 执⾏对应的回调时发⽣异常就执⾏promise2的失败
            reject(e)
          }
        }, 0)
      }
      // 其它情况也是⼀样来处理...
    })
    return promise2
  }
}
```

### **2.4 resolvePromise**实现

> 因为所有的 promise 都是按照 Promisea+规范来实现的，所以可以做到互相组合使⽤。此⽅法需要解决不同的 promise 库之间的调⽤问题。

#### **1) x 和 promise2 引⽤同⼀个值**

```js
const promise2 = new Promise((resolve, reject) => {
  resolve("ok")
}).then((data) => {
  return promise2 // 返回的 promise2 不会成功也不会失败。那就直接⾛失败了
})
promise2.then(null, (err) => {
  console.log(err)
})
```

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(
      new TypeError(
        "[TypeError:Chaining cycle detected for promise #<Promise>]"
      )
    )
  }
}
```

#### **2)** **多次取**then 可能会发⽣异常

```js
// 其它⼈实现的promise可能是这样实现的~
let promise = {}
let times = 0
Object.defineProperty(promise, "then", {
  get() {
    if (++times === 2) {
      throw new Error()
    }
  },
})
promise.then // 第⼀次取then正常
promise.then // 第⼆次取then报错
// 所以要避免多次取then的情况
```

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(
      new TypeError(
        "[TypeError:Chaining cycle detected for promise #<Promise>]"
      )
    )
  }
  // 如何判断x是不是promise? 就看有没有then⽅法，有then⽅法的前提得是x是⼀个对象或者函数
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      let then = x.then // 缓存then
      if (typeof then === "function") {
        //看then是不是⼀个函数
        // 如果有⼀个then⽅法那么就说他是
        promise
        // 是promise 要判断是成功的promise还是失败的promise，在调⽤promise2对应的resolve或者reject
        then.call(
          x,
          (y) => {
            resolve(y)
          },
          (r) => {
            reject(r)
          }
        )
      } else {
        resolve(x) // 这⾥直接成功即可 普通值的情况
      }
    } catch (e) {
      reject(e) // 直接失败即可
    }
  } else {
    resolve(x) // 这⾥直接成功即可 普通值的情况
  }
}
```

#### **3)** **防⽌重复调⽤**

```js
let otherPromise = {
  then(onFulfilled, onRejected) {
    // 别⼈家的promise可能既调⽤了成功⼜调⽤了失败
    throw new Error(onFulfilled("ok"))
    onRejected("no ok")
  },
}
const promise2 = new Promise((resolve, reject) => {
  resolve("ok")
}).then((data) => {
  return otherPromise // 返回的不是⾃⼰的
  promise
})
```

```js
if ((typeof x === "object" && x !== null) || typeof x === "function") {
  let called = false
  try {
    let then = x.then
    if (typeof then === "function") {
      then.call(
        x,
        (y) => {
          if (called) return // 成功在调⽤失败
          called = true
          resolve(y)
        },
        (r) => {
          if (called) return // 失败在调⽤成功
          called = true
          reject(r)
        }
      )
    } else {
      resolve(x)
    }
  } catch (e) {
    if (called) return // 失败在调⽤成功
    called = true
    reject(e)
  }
} else {
  resolve(x)
}
```

#### **4)** **递归解析**

```js
new Promise((resolve, reject) => {
  resolve()
})
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(100)
            }, 1000)
          })
        )
      }, 1000)
    })
  })
  .then((data) => {
    console.log(data)
  })
```

```js
then.call(
  x,
  (y) => {
    if (called) return
    called = true
    resolvePromise(promise2, y, resolve, reject) //如果resolve的值还是promise，则递归解析
  },
  (r) => {
    if (called) return
    called = true
    reject(r)
  }
)
```

### **2.5 then**中可选参数

> 如果当前 then 中没有处理成功和失败，则会穿透到下⼀个 then 中进⾏处理

```js
const promise1 = new Promise((resolve, reject) => {
  resolve("ok")
})
// 成功的传递
promise1
  .then()
  .then()
  .then((data) => {
    console.log(data)
  })
const promise2 = new Promise((resolve, reject) => {
  reject("fail")
})
// 失败的传递
promise2
  .then()
  .then()
  .then(null, (err) => {
    console.log(err)
  })
```

```js
then(onFulfilled, onRejected) {
onFulfilled = typeof onFulfilled ==='function' ? onFulfilled : v => v
onRejected = typeof onRejected === 'function'? onRejected : reason => { throw reason }
}
```

### **2.6** **测试**Promise

> 默认测试的时候会调⽤此⽅法 会检测这个⽅法返回的对象是否符合规范，这个对象上需要有 promise 实例及 resolve 和 reject ⽅法

```js
Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
```

```bash
npm install promises-aplus-tests -g # 测试包
promises-aplus-tests <filename>
```

### **2.7 resolve**问题解决

```js
const promise = new Promise((resolve, reject) => {
  // 在ECMAScript中
  // 我们在excutor中resolve⼀个promise会进⾏递归解析
  resolve(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("ok")
      }, 1000)
    })
  )
}).then((data) => {
  console.log(data) // ok
})
```

```js
const resolve = (value) => {
  // 如果值是Promise，则需要进⾏递归解析
  if (value instanceof Promise) {
    return value.then(resolve, reject)
  }
  if (this.status === PENDING) {
    this.status = FULFILLED
    this.value = value
    this.onResolvedCallbacks.forEach((fn) => fn())
  }
}
```
