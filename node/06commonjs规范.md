---
title: 6. commonjs规范
last_update:
  date: 02/09/2023
  author: 高红翔
---

## 1. 基本实现

> CommonJS 规范是 Node 中使⽤的模块化规范。定义了模块的导出和引⼊的⽅式，可以再多个⽂件之间共享 JavaScript
>
> 代码。

- 每个 js ⽂件都是⼀个模块

- 每个模块想去引⽤别⼈的模块，需要采⽤ require 语法 import

- 每个模块想被别⼈使⽤需要采⽤ module.exports 进⾏导出 export

b.js

```js
module.exports = "hello b"

console.log("ok")
```

b.json

```json
{
  "name": "Jiang"
}
```

useB.js

```js
const fs = require("fs")
const path = require("path")
const vm = require("vm")
function Module(id) {
  this.id = id
  this.exports = {} // 模块最终的导出的结果都在这里面
}
Module._cache = {} // 模块缓存
Module._extensions = {
  ".js"(module) {
    const content = fs.readFileSync(module.id, "utf8")
    // 如何将字符串包装成函数, 可以用new Function来直接实现
    // console.log(new Function('a','b','c',content).toString())
    // eval 找的是上层作用域 可以直接将代码放到这个eval转成成js
    // 支持沙箱 可以保证作用域不污染，可以指定函数中的this,手动指定上下文
    // 快照， 通过proxy来实现沙箱
    const wrapperFunction = vm.compileFunction(content, [
      "module",
      "exports",
      "require",
      "__dirname",
      "__filename",
    ])

    let require = req
    let __dirname = path.dirname(module.id) // 文件对应的目录
    let __filename = module.id // 绝对路径
    Reflect.apply(wrapperFunction, exports, [
      module,
      exports,
      require,
      __dirname,
      __filename,
    ])
  },
  ".json"(module) {
    // json如何处理
    const content = fs.readFileSync(module.id, "utf8")
    module.exports = JSON.parse(content)
  },
}
Module._resolveFilename = function (id) {
  // 默认会查找同名的文件，会尝试添加后缀
  const exts = Reflect.ownKeys(Module._extensions)
  let isExisits = fs.existsSync(id) // 不会抛错 fs.access 需要用tryCatch
  if (isExisits) return path.resolve(__dirname, id)
  // 先查找js在查找json
  for (let i = 0; i < exts.length; i++) {
    let fileUrl = path.resolve(__dirname, id) + exts[i]
    if (fs.existsSync(fileUrl)) {
      return fileUrl
    }
  }
  throw new Error("模块未找到")
}
Module.prototype.load = function () {
  const ext = path.extname(this.id) // a.min".js"
  Module._extensions[ext](this) // 根据后缀名来处理对应的模块
}
function req(id) {
  // 1.根据用户传递的id 来进行模块的加载，相对路径转换成绝对路径
  let absPath = Module._resolveFilename(id)
  // 2.创建模块
  let existsModule = Module._cache[absPath] // 是否存在这个模块
  if (existsModule) {
    return existsModule.exports // 返回上一次导出的结果
  }
  const module = new Module(absPath) // 如果我多次require模块这个模块只会被读取一次
  Module._cache[absPath] = module
  // 3.就是加载这个模块
  module.load() // 加载完模块后既可以拿到最终的模块导出结果
  return module.exports
}
const result = req("./b.json")
console.log(result)
```

## 2. 循环引用

module-a.js

```js
let b = require("./module-b")
console.log(b, "在a中打印的b")
module.exports = "a"
```

module-b.js

```js
let a = require("./module-a")
console.log(a, "在b中打印的a")

module.exports = "b"
```

在 a 模块中运行输出

```js
// cache = {
//     'module-a': new Module({exports:{}}), // b中打印的a是空的
//     'module-b': new Module({exports:{}})
// }
```

```js
//{} 在b中打印的a
//b 在a中打印的b
```

> commonjs 不会死循环，⽽是加载已经加载的部分结果，因为如果缓存中有，则使⽤缓存中的 exports 结果。初始化时默认会将当前模块也放⼊到缓存中
>
> 对于 commonjs 规范来说，可以实现部分加载

**那循环引⽤问题如何解决呢？**

- 合理的模块划分，避免循环依赖

- 采⽤⾮强制依赖关系。

a1.js

```js
function say() {
  console.log("a中的say方法,希望在b模块中使用")
}

let moduleB // 你告诉我我依赖的是谁
module.exports = {
  say,
  save(mod) {
    moduleB = mod
  },
  init() {
    moduleB.say()
  },
}
```

b1.js

```js
function say() {
  console.log("b中的say方法,希望在a模块中使用")
}

let moduleA // 你告诉我我依赖的是谁
module.exports = {
  save(mod) {
    moduleA = mod
  },
  say,
  init() {
    moduleA.say()
  },
}
```

useA1B1.js

```js
const a1 = require("./a1")
const b1 = require("./b1")

a1.save(b1)
b1.save(a1)

// 模块一定已经加载完毕了

a1.init()
b1.init() // 通过延后处理的方式来实 解决循环引用的问题
//b中的say方法,希望在a模块中使用
//a中的say方法,希望在b模块中使用
```

## **3 .exports**和**module.exports**的区别

> module.exports 和 exports 引⽤的是同⼀个内存地址，但是导⼊模块时最终采⽤的是 module.exports 结果

```js
function require() {
  let exports = (module.exports = {})
  // 这⾥要注意，如果我们直接修改exports是⽆效的
  // export = 'hello' // 无效
  // exports = {}; // ⽆效
  // exports.xxx = {}; // 有效
  return module.exports
}
```

**第一种情况**

a.js

```js
export = 'hello' // exports = '值' 这种方式不会生效，最终返回的是module.exports
```

useA.js

```js
const str = require(./a)
console.log(str) //{}
```

**第 二种情况**

a.js

```js
module.exports = { a: "hello" }
//export.a = 'hello'
//module.exports.a = ‘hello'
//this.a = 'hello'
```

useA.js

```js
const str = require(./a)
console.log(str) //{ a: 'hello' }
```

**第 三种情况**

a.js

```js
module.exports = { a: "hello" }
exports.b = "hello"
```

useA.js

```js
const str = require(./a)
console.log(str) //{ a: 'hello' }
```

- module.exports（默认导出）不能和 exports 连用

## **4. this**问题

> Node 中的 this 指向的是 exports 对象，不是全局对象。⽬的是为了⽤户可以再 this 上挂载属性实现快速导出

a.js

```js
this.a = "hello"
```

useA.js

```js
const str = require(./a)
console.log(str) //{ a: 'hello' }
```

## **5.**思考

> 如果⽤户导出的是⼀个变量，后续变量被修改了，是否会影响导⼊的值

```js
// exportsA.js
let a = 0
setInterval(() => {
  a++
}, 1000)
module.exports = a // 如果导出的是引⽤类型则会产⽣变化。
// useExportsA.js
setInterval(() => {
  let a = require("./exportsA")
  //多次require拿到是第一个,第一个值如果是对象，对象中的内容变化了可以得到更新，如果是具体的值 则不会变化
  console.log(a) // require会缓存上次导⼊的结果。
}, 1000)
```
