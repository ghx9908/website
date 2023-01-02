---
title: 实现promise中断请求
last_update:
  date: 01/02/2023
  author: 高红翔
---

## 普通写法

```js
//接口超过1秒提升超时
let r
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    r = reject
    // 模拟请求
    resolve("成功")
  }, 2000)
})
setTimeout(() => {
  r("超时")
}, 1000)
```

## 采用 Promise.deferred（超时对象）

```js
Promise.deferred = function () {
  // deferred  all race catch ...
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
let dfd = Promise.deferred()
function getData() {
  setTimeout(() => {
    dfd.resolve("成功")
  }, 2000)
  return dfd.promise
}
setTimeout(() => {
  dfd.reject("超时  111")
}, 1000)

getData()
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

## 封装 withAbort

```js
function withAbort(userPromise) {
  let abort
  let innerPromise = new Promise((resolve, reject) => {
    abort = reject
  })
  let racePromise = Promise.race([userPromise, innerPromise]) // 增添控制走向失败的逻辑
  racePromise.abort = abort // 将中断方法暴露到p上
  return racePromise
}

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    // 模拟请求
    resolve("成功")
  }, 2000)
})

p = withAbort(p)
setTimeout(() => {
  //   p.abort("超时");
}, 1000)
p.then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})
```
