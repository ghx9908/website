---
title: 5. Node 的基本概念
last_update:
  date: 02/07/2023
  author: 高红翔
---

## 1.Node 是什么?

Node.js 是一个 **JavaScript 运行环境**，它是**基于 Chrome's V8 引擎**构建的，使 JavaScript 可以在服务器端运行。Node.js **特点：事件驱动、非阻塞 I/O** 。(**支持 ECMAScript、内置模块、第三方模块**)

### 1.1 事件驱动

指程序按照事件的发生顺序来触发响应的处理，能够在不阻塞其他事件的情况下处理多个事件。Node 中也有一个事件环，不断地检查事件队列中是否有新的事件，并触发相应的回调函数。适用于**网络应用程序和 I/O 密集型**应用程序。

### 1.2 非阻塞 I/O

当程序发出一个 I/O 请求时，如果不能立即得到结果，不会阻塞程序的执行，而是立即返回，以便程序可以继续执行其他任务。

## 2.单线程与多线程

### 2.1 多线程

**优点：**可以同时执行多个任务 （多个请求到来的时候，需要开启对应的线程来进行处理。利用**线程池来进行优化**） 可利用多核 CPU 的资源。适合处**理 CPU 密集型** （压缩、解密、加密）
**缺点：**线程间**通信复杂**、多线程间锁的问题、开辟线程需要占用内存等问题。

### 2.2 单线程

**优点：**节约内存资源、没有锁的问题、调试容易。**适合 I/O 密集型操作**
**缺点**：无法充分利用多核 CPU，**复杂操作会阻塞主线程**。

## 3.同步和异步

同步：在执行一个操作时，程序必须等待该操作完成后才能继续执行下一步操作。
异步：在执行一个操作时，程序不需要等待该操作完成，而是可以继续执行其他任务。

> 思考：阻塞和非阻塞、同步和异步的关系？ 异步一定是非阻塞的吗(一定)，同步一定是阻塞的吗（一定）， 针对是调用方和被调用来说的。

- 当我们调用一个方法之后，收否需要等待这个操作返回的结果 （不需要等待就是异步操作， 同步操作就是需要等待这个操作的返回值）
- Promise.then(原生的 promise) setTimeout mutationObserver(h5 提供的 api) ajax 请求 用户的事件 setImmediate(ie 特有的) 脚本， ui 渲染
- process.nextTick i/o setImmediate
- requestAnimationFrame requestIDleCallback (16.6ms) 到达渲染时机后 帧执行之前 requestFrameAnimation 方法 一针执行完毕后剩余的时间 requestIDleCallback （回调）

## 4.Node 使用场景？

- 搭建服务端，采用 koa、express、nestjs、eggjs 等
- 编写前端工具链，gulp、webpack、vite、rollup 以及常用的命令行工具
- 为前端服务，作为中间层使用，解决跨域问题、进行数据处理 BFF(Back-end For Front-end)
- SSR 服务端渲染
- 实现及时通讯应用，爬虫等

## 5.为什么要有模块化

> 模块化规范：（cmd、amd）、umd、 iife、es6Module、commonJS 等

- 提升代码可重用性和可扩展性。
- 方便维护，高内聚低耦合，解决**变量冲突问题，隔离**
- Node 中实现模块采用函数来进行模块划分的。

## 6.commonjs 规范

- 每个 js 文件都是一个模块
- 每个模块想去引用别人的模块，需要采用 require 语法 import
- 每个模块想被别人使用需要采用` module.exports` 进行导出 export

#### 案例

a.js

```js
module.exports = "结果"
```

a.json

```json
{
  "a": 1
}
```

useA.js

```js
const str = require("./a") // .js 后缀 .json 后缀可以隐藏， 默认先找js文件
console.log(str)
```

#### 简化的 require

```js
// 1) 内部采用了同步读取的方案 ，将文件内容获取到。 require方法是同步的。 底层用的是同步的读取 fs.readFileSync
function require(文件名) {
  // 根据文件名获取内容，包装函数，并且把获取到的结果放到module.exports
  let module = {
    exports: "",
  }
  ;(function (module, exports) {
    module.exports = "结果"
  })(module, module.exports)
  return module.exports
}
```

#### **模块的分类**

- 文件模块: 路径来引入的模块 自己写的模块，文件模块

- 内置模块:核心模块 fs 模块核心模块 path 模块

- 第三方模块：别人写好的安装的

#### 基本实现

```js
// 1) Module._load  加载这个模块
// 2) Module._resolveFilename( 处理路径为绝对路径， 并且添加文件后缀
// 3) 拿到文件 看一下文件是否加载过 Module._cache 是否缓存过，如果缓存过则直接结束
// 4) 如果没有缓存过 则会new Module(id,exports = {})  exports 是对应模块的导出结果，默认为空
// 5) 将创建的模块缓存
// 6) 根据文件加载模块 （给module.exports 赋值）
// 7) 找到对应的文件后缀 做加载操作 Module._extensions[.js](this, filename); 策略模式
// 8) 读取文件内容 fs.readFileSync(filename, 'utf8');
// 9) 将字符串执行  module._compile 编译字符串
// 10) 包裹函数 'exports','require','module','__filename', '__dirname',
// module.exports = exports
// this = exports
// 11) Reflect.apply(this,[exports,require,module,filename,path.dirname])   module.exports = 'abc'
// 最终返回的是 module.exports
const fs = require("fs")
const path = require("path")
const vm = require("vm")

function Module(id) {
  this.id = id
  this.exports = {}
}

Module._extensions = {}
Module._extensions[".js"] = function (module) {
  const content = fs.readFileSync(module.id, "utf-8")
  let fn = vm.compileFunction(content, [
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
  ])
  let exports = module.exports
  let thisValue = exports
  let filename = module.id
  let dirname = path.dirname(filename)
  // 函数执行的时候  会自动的给module.exoports 赋值
  Reflect.apply(fn, thisValue, [exports, req, module, filename, dirname]) // 如果用户没有写module.exports
}
Module._extensions[".json"] = function (module) {
  const content = fs.readFileSync(module.id, "utf-8")
  // jsonj 就是直接将结果富裕到module.exports 上即可
  module.exports = JSON.parse(content)
}

// 加载模块
Module.prototype.load = function () {
  let ext = path.extname(this.id) // js
  // 根据后缀加载文件
  Module._extensions[ext](this)
}
Module._resolveFilename = function (id) {
  const filepath = path.resolve(__dirname, id)
  if (fs.existsSync(filepath)) return filepath

  // 没有这个文件 尝试添加后缀
  let exts = Reflect.ownKeys(Module._extensions)
  for (let i = 0; i < exts.length; i++) {
    let newFilePath = filepath + exts[i]
    if (fs.existsSync(newFilePath)) return newFilePath
  }
  throw new Error("Connot found module")
}
function req(id) {
  // 解析文件的绝对路径 添加后缀
  let filename = Module._resolveFilename(id)
  let module = new Module(filename)
  module.load() // 这里就是加载文件 给module.exports 赋值
  return module.exports // {}
}

const r = req("./a.json")
console.log(r)
```
