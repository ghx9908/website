---
title: promisify 的实现
last_update:
  date: 01/01/2023
  author: 高红翔
---

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
