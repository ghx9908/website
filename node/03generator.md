---
title: 3. generator
last_update:
  date: 02/07/2023
  author: 高红翔
---

> Promise 通过链式调用解决了异步问题 `.then(()=>{}).then().then()` 还是基于回调来实现

## 1.generator 概念

> 基于 promise 把异步代码变得更像同步

- generator 是一个特殊的函数 （生成器） 这个函数可以暂停，也可以继续执行

- 可以通过 generator 来控制我们异步流程( 类似于调试的 debugger)

```js
function* read() {
  // es6语法
  // 产出
  yield "vue"
  yield "react"
  return "node"
}
```

所谓的**生成器 执行后返回的是迭代器**，当我调用迭代器的时候 就可以向下继续执行

```js
let it = read() // iterator 迭代器, 迭代器必须要拥有一个next方法
console.log("it=>", it)
// next方法  {value:表示当前产出的值,done:是否函数执行完成}
console.dir(it.next()) //{ value: 'vue', done: false }
console.log(it.next()) //{ value: 'react', done: false }
console.log(it.next()) //{ value: 'node', done: true }
console.log(it.next()) //{ value: 'undefined', done: true }
```

现在是**手动调用**，正常应该自动帮我们调用 next

## 2.generator 使用场景

- 遍历的时候 就可以使用 generator 来进行实现

> 返回 new Set([1, 2, 3]) 的第一项

```js
let set = new Set([1, 2, 3])
// set 调用.values（）返回的就是迭代器
console.log(set.values().next().value)
console.log([...set][0])
```

- 将一个类数组转换成数组

**类数组：有索引、有长度、能遍历 就是类数组**

```js
const likeArray = { 0: 1, 1: 2, 2: 3, length: 3 } // 只有索引和长度如何遍历
console.log(Array.from(likeArray)) // [ 1, 2, 3 ]  from 内部调用了generator
for (let key of likeArray) {
} // TypeError:likeArray is not iterable
const arr = [...likeArray] // TypeError:likeArray is not iterable
```

### **实现 Symbol.iterator**

```js
const likeArray = { 0: 1, 1: 2, 2: 3, length: 3 }
// Symbol 有很多操作可以改变原有的js的特性，元编程
likeArray[Symbol.iterator] = function () {
  let arr = this // -> likeArray
  let len = arr.length
  let idx = 0
  return {
    next() {
      // {value:ok,done:true}
      return { value: arr[idx], done: idx++ === len }
    },
  }
}

const arr = [...likeArray]
console.log(arr) // [ 1, 2, 3 ]
```

generator 函数返回一个 iterator 迭代器

```js
const likeArray = { 0: 1, 1: 2, 2: 3, length: 3 }
likeArray[Symbol.iterator] = function* () {
  let len = this.length
  let idx = 0
  while (idx !== len) {
    yield this[idx++]
  }
}
const arr = [...likeArray]
console.log(arr) // [ 1, 2, 3 ]
```

## 3. yield 返回值

- 无参数情况

```js
function* read() {
  let a = yield "vue"
  console.log(a, "a")
  let b = yield "react"
  console.log(b, "b")
  return "node"
}
const it = read()
it.next()
it.next() // undefined a
it.next() // undefined b
```

- next 传参

特点是 next 中传递的参数是**上一次 yield 的返回值**，但是第一的 next 参数是无意义的

```js
function* read() {
  try {
    let a = yield "vue"
    console.log(a, "a") // 我处理第一个异步逻辑出错了，就不要继续执行了
    let b = yield "react"
    console.log(b, "b")
    return "node"
  } catch (e) {
    console.log(e, "出错了")
  }
}
const it = read()
it.next("a") // 第一的next参数是无意义的
it.next("abc") // abc a //next中传递的参数是上一次yield的返回值
it.next("bcd") // bcd b
```

**每次 next 传的参数都是给上一次 yield 的返回值**

- 抛错

```js
function* read() {
  let a = yield "vue"
  console.log(a, "a") // 我处理第一个异步逻辑出错了，就不要继续执行了
  let b = yield "react"
  console.log(b, "b")
  return "node"
}
const it = read()
it.next("a") // 第一的next参数是无意义的
it.next("abc") // abc a //next中传递的参数是上一次yield的返回值
it.throw("出错了") // 出错了 出错了
it.next("bcd")
```

## 4. 案例（读取文件）

- 最早 callback 来解决异步

- promise 链式调用

- generator + promise + co

- async + await

fileUrl.txt

```txt
name.txt
```

name.txt

```js
Jiang
```

#### 1. generator

main.js

```js
const fs = require("fs/promises")
const path = require("path")
function* readFile() {
  // 基于generator
  try {
    console.log(
      'path.resolve(__dirname, "fileUrl.txt")=>',
      path.resolve(__dirname, "fileUrl.txt")
    )
    let data = yield fs.readFile(path.resolve(__dirname, "fileUrl.txt"), "utf8")
    let name = yield fs.readFile(path.resolve(__dirname, "name.txt"), "utf8")
    return name
  } catch (e) {
    console.log(e, "读取出错")
  }
}
const it = readFile()
{
  let { value, done } = it.next()
  Promise.resolve(value).then((data) => {
    // data 就是第一次产出后的promise结果
    let { value, done } = it.next(data)
    Promise.resolve(value).then((name) => {
      let { value, done } = it.next(name)
      console.log(value, done)
    })
  })
}
```

#### 2. co 库(generator + promise + co)

```js
const fs = require("fs/promises")
const path = require("path")
const co = require("co")
function* readFile() {
  // 基于generator
  try {
    console.log(
      'path.resolve(__dirname, "fileUrl.txt")=>',
      path.resolve(__dirname, "fileUrl.txt")
    )
    let data = yield fs.readFile(path.resolve(__dirname, "fileUrl.txt"), "utf8")
    let name = yield fs.readFile(path.resolve(__dirname, data), "utf8")
    return name
  } catch (e) {
    console.log(e, "读取出错")
  }
}
co(readFile()).then((data) => {
  console.log(data)
})
```

#### 3. co 库(generator + promise + co)

```js
const fs = require("fs/promises")
const path = require("path")
function co(it) {
  return new Promise((resolve, reject) => {
    // 递归回调
    function next(data) {
      // 异步递归处理
      let { value, done } = it.next(data)
      if (!done) {
        Promise.resolve(value).then((data) => {
          next(data)
        })
      } else {
        resolve(value) // 整个geneator执行完毕了 结束
      }
    }
    next() // koa express
  })
}

function* readFile() {
  // 基于generator
  try {
    console.log(
      'path.resolve(__dirname, "fileUrl.txt")=>',
      path.resolve(__dirname, "fileUrl.txt")
    )
    let data = yield fs.readFile(path.resolve(__dirname, "fileUrl.txt"), "utf8")
    let name = yield fs.readFile(path.resolve(__dirname, data), "utf8")
    return name
  } catch (e) {
    console.log(e, "读取出错")
  }
}
co(readFile()).then((data) => {
  console.log(data)
})
```

#### 4. async 和 await

```js
// (async + await === generator + co) + promise的

const fs = require("fs/promises")
const path = require("path")
async function readFile() {
  // 基于generator
  try {
    let data = yield fs.readFile(path.resolve(__dirname, "fileUrl.txt"), "utf8")
    let name = await fs.readFile(path.resolve(__dirname, data), "utf8")
     // await Promise.all()
    // await Promise
    return name
  } catch (e) {
    console.log(e, "读取出错")
  }
}
readFile().then((data) => {
  console.log(data)
})
```
