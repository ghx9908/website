---
title: 4. webpack 打包后模块分析
sidebar_position: 4
---

## 1. 同步加载

### 没有依赖

src\index.js

```js
console.log(title)
```

bundle.js

```js
//导出对象
var exports = {}
//模块内容
console.log(title)
```

### **打包模块分析**

src\index.js

```JS
let title = require("./title.js");
console.log(title);
```

src\title.js

```js
module.exports = "title"
```

bundle.js

> 未加入缓存

```js
//模块定义
//key是模块ID，也就是模块相对于相前根目录的相对路径
var modules = {
  "./src/title.js": (module) => {
    module.exports = "title"
  },
}
//加载模块，执行 modules 对应的函数
function require(moduleId) {
  var module = {
    exports: {},
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}

//入口
var exports = {}
let title = require("./src/title.js")
console.log(title)
```

## 2. 兼容性实现

### 2.1 common.js 加载 common.js

#### 2.1.1 index.js

```js
let title = require("./title")
console.log(title.name)
console.log(title.age)
```

#### 2.1.2 title.js

```js
exports.name = "title_name"
exports.age = "title_age"
```

#### 2.1.3 bundle.js

```js
;(() => {
  //需要加载的模块
  var modules = {
    "./src/title.js": (module, exports) => {
      exports.name = "title_name"
      exports.age = "title_age"
    },
  }
  //缓存
  var cache = {}
  //require 方法
  function require(moduleId) {
    var cachedModule = cache[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports
    }
    var module = (cache[moduleId] = {
      exports: {},
    })
    modules[moduleId](module, module.exports, require)
    return module.exports
  }
  // 入口
  var exports = {}
  ;(() => {
    let title = require("./src/title.js")
    console.log(title.name)
    console.log(title.age)
  })()
})()
```

### 2.2 common.js 加载 ES6 modules

#### 2.2.1 index.js

```js
let title = require("./title")
console.log(title)
console.log(title.age)
```

#### 2.2.2 title.js

```js
export default "title_name"
export const age = "title_age"
```

#### 2.2.3 bundle.js

> 去除了自执行函数和模块缓存

- 打包前面是 commonjs 打包后不需要变，打包前是 esmodule 打包后得变

```js
/**
 * 如果原模块是esmodule
 * 先执行require.r
 * 再执行require.d
 */
var modules = {
  "./src/title.js": (module, exports, require) => {
    //1.声明或者说表示当前的模块原来是一个es module
    require.r(exports)
    //2. 定义属性
    require.d(exports, {
      age: () => age,
      default: () => DEFAULT_EXPORTS, //值是一个getter
    })
    //默认导出
    const DEFAULT_EXPORTS = "title_name"
    //命名导出
    const age = "title_age"
  },
}
/**
 * 执行modules对象对应的模块函数
 * @param {*} moduleId 模块Id
 * @returns module.exports
 */
function require(moduleId) {
  var module = {
    exports: {},
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}
/**
 * 给exports 上面定义属性
 * @param {*} exports 导出对象
 * @param {*} definition 定义的属性
 */
require.d = (exports, definition) => {
  //遍历key
  for (var key in definition) {
    //在 definition 上不在 exports 上就赋值
    if (require.o(definition, key) && !require.o(exports, key)) {
      // 给exports 上面定义属性 geT 获取
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}
//对象自身属性中是否具有指定的属性
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/**
 * 给exports 声明 Symbol.toStringTag为Module ，__esModule 未true
 * @param {*} exports
 */
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    })
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
}

var exports = {}

let title = require("./src/title.js")
console.log(title)
console.log(title.default)
console.log(title.age)
```

### 2.3 ES6 modules 加载 ES6 modules

#### 2.3.1 index.js

```js
import name, { age } from "./title"
console.log(name)
console.log(age)
```

#### 2.3.2 title.js

```js
export default name = "title_name"
export const age = "title_age"
```

#### 2.3.3 bundle.js

```js
/**
 * 如果原模块是esmodule
 * 先执行require.r
 * 再执行require.d
 */
var modules = {
  "./src/title.js": (module, exports, require) => {
    //1.声明或者说表示当前的模块原来是一个es module

    require.r(exports)
    //2. 定义属性
    require.d(exports, {
      age: () => age,
      default: () => _DEFAULT_EXPORT__,
    })
    // 此处为了实现Livbinding做准备
    const _DEFAULT_EXPORT__ = (name = "title_name")
    const age = "title_age"
  },
}
var cache = {}
/**
 * 执行modules对象对应的模块函数
 * @param {*} moduleId 模块Id
 * @returns module.exports
 */
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {},
  })
  modules[moduleId](module, module.exports, require)
  return module.exports
}
/**
 * 给exports 上面定义属性
 * @param {*} exports 导出对象
 * @param {*} definition 定义的属性
 */
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/**
 * 给exports 声明 Symbol.toStringTag为Module ，__esModule 未true
 * @param {*} exports
 */
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    })
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
}

//入口
var exports = {}
//标明是esModule模块
require.r(exports)
//加载对应的模块
var _title_0__ = require("./src/title.js")
//取值
console.log(_title_0__["default"])
console.log(_title_0__.age)
```

### 2.4 ES6 modules 加载 common.js

#### 2.4.1 index.js

```js
import name, { age } from "./title"
console.log(name)
console.log(age)
```

#### 2.4.2 title.js

```js
module.exports = {
  name: "title_name",
  age: "title_age",
}
```

#### 2.4.3 bundle.js

```js
/**
 * 如果原模块是esmodule
 * 先执行require.r
 * 再执行require.d
 */
var modules = {
  "./src/title.js": (module, exports, require) => {
    //1.声明或者说表示当前的模块原来是一个es module

    require.r(exports)
    //2. 定义属性
    require.d(exports, {
      age: () => age,
      default: () => _DEFAULT_EXPORT__,
    })
    // 此处为了实现Livbinding做准备
    const _DEFAULT_EXPORT__ = (name = "title_name")
    const age = "title_age"
  },
}
var cache = {}
/**
 * 执行modules对象对应的模块函数
 * @param {*} moduleId 模块Id
 * @returns module.exports
 */
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {},
  })
  modules[moduleId](module, module.exports, require)
  return module.exports
}
/**
 * 给exports 上面定义属性
 * @param {*} exports 导出对象
 * @param {*} definition 定义的属性
 */
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/**
 * 给exports 声明 Symbol.toStringTag为Module ，__esModule 未true
 * @param {*} exports
 */
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    })
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
}

//入口
var exports = {}
//标明是esModule模块
require.r(exports)
//加载对应的模块
var _title_0__ = require("./src/title.js")
//取值
console.log(_title_0__["default"])
console.log(_title_0__.age)
```

## 3. 异步加载实现分析

### 打包前

index.js

```js
import("./title.js").then((module) => {
  console.log(module.default)
  import("./title.js").then((module) => {
    console.log(module.default)
  })
})
```

title.js

```js
export default "title"
```

### 打包后

main.js

```js
//定义一个模块定义的对象
var modules = {}
//存放已经加载的模块的缓存
var cache = {}
//在浏览器里实现require方法
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {},
  })
  modules[moduleId](module, module.exports, require)
  return module.exports
}
//给require方法定义一个m属性，指向模块定义对象
require.m = modules
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}
require.f = {} //空对象
/**
 *
 * @param {*} chunkId  chunk 代码块 模块的集合
 * @returns 返回Promise
 */
require.e = (chunkId) => {
  let promises = []
  require.f.j(chunkId, promises)
  return Promise.all(promises)
}
//源代码加载绝对路径 此处写成''
require.p = ""
//返回此代码块对应的文件名
require.u = (chunkId) => {
  return "" + chunkId + ".main.js"
}
require.g = (function () {
  if (typeof globalThis === "object") return globalThis
  try {
    return this || new Function("return this")()
  } catch (e) {
    if (typeof window === "object") return window
  }
})()
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
// 通过JSONP加载代码 动态加载代码 原代码中会有一个定时器，成功后达到时间删除创建script标签
require.l = (url) => {
  let script = document.createElement("script")
  script.src = url
  document.head.appendChild(script)
}
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    })
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
}

//存放加载的代码块的状态
//key是代码块的名字
//0表示已经加载完成了
var installedChunks = {
  main: 0,
  //当一个代码块它的值是一个数组的时候表示此代码块对应的JS文件正在加载中
  //'src_hello_js':[resolve,reject,promise]=>0
}
/**
 * 通过JSONP异步加载一个chunkId对应的代码块文件，其实就是title.main.js
 * 会返回一个Promise
 * @param {*} chunkId 代码块ID
 * @param {*} promises promise数组
 */
require.f.j = (chunkId, promises) => {
  //做缓存  当前的代码块的数据
  var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined
  if (installedChunkData !== 0) {
    const promise = new Promise((resolve, reject) => {
      installedChunkData = installedChunks[chunkId] = [resolve, reject]
    })
    installedChunkData[2] = promise
    //installedChunkData=[resolve,reject,promise]
    promises.push(promise)
    const url = require.p + require.u(chunkId)
    require.l(url)
  }
}
/**
 *
 * @param {*} chunkIds 代码块ID数组
 * @param {*} moreModules 额外的模块定义
 */
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = []
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i] //src_title_js
    const resolve = installedChunks[chunkId][0]
    resolves.push(resolve)
    //到这里此代码块就已经加载成功了，可以把chunkId的值设置为0
    installedChunks[chunkId] = 0
  }
  //合并模块定义到modules去
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId]
  }
  while (resolves.length) {
    //取出所有的resolve方法，让它执行，让它对应的promise变成成功态
    resolves.shift()()
  }
}
const chunkLoadingGlobal = (window["someName"] = [])
chunkLoadingGlobal.push = webpackJsonpCallback
var exports = {}
/**
 * require.e异步加载title代码块文件 title.main.js
 * promise成功后会把 title.main.js里面的代码定义合并到require.m对象上，也就是modules上
 * 调用require方法加载./src/title.js模块，获取 模块的导出对象，进行打印
 */
require
  .e("src_title_js")
  .then(require.bind(require, "./src/title.js"))
  .then((module) => {
    console.log(module.default)
    require
      .e("src_title_js")
      .then(require.bind(require, "./src/title.js"))
      .then((result) => {
        console.log(result.default)
      })
  })
```

src_title_js.main.js

```js
window["someName"].push([
  ["src_title_js"],
  {
    "./src/title.js": (module, exports, require) => {
      require.r(exports)
      require.d(exports, {
        default: () => _DEFAULT_EXPORT__,
      })
      const _DEFAULT_EXPORT__ = "title"
    },
  },
])
```

> > 安装 VScode 插件，rm-js-common 可以删除代码注释

## 4 总结

### 核心方法

- **modules 对象 ** key 是模块 ID，也就是模块相对于相前根目录的相对路径 值为对应加载模块的内容函数

- **require 方法** 执行 modules 对象对应的模块函数 返回 modules.exports 对象

- **require.d 方法** 通过 defineProperty 给 exports 上设置属性 get 获取

- **require.o 方法** 对象自身属性中是否具有指定的属性

- **require.r 方法** 标明该模块是 esModele 模块

- **require.n 方法** 返回函数兼容性处理默认值 ，esModule 模块 是的返回 module["default"] 否则 commonjs 模块返回本身

- **require.m 方法** 指向模块定义对象 equire.m = modules;

- **require.p 方法** 获取要加载文件的绝对路径

- **require.u 方法** 返回此代码块对应的文件名

- **require.l 方法** 返回此代码块对应的文件名

- **require.f.j 方法**

- **require.e 方法** 异步加载代码块文件

  - 返回 Promise.all([promises])
  - promise 成功后会把 加载里面的代码定义合并到 require.m 对象上，也就是 modules 上
  - 调用 require 方法加载对应模块，获取 模块的导出对象，进行打印

  **installedChunks 对象** //存放加载的代码块的状态 //key 是代码块的名字 //0 表示已经加载完成了

### **兼容处理**

- **common.js 加载 common.js**
  1. 直接调用 require 方法 执行 modules 对象对应的函数返回 modules.exports 对象
- **common.js 加载 ES6 modules**

1.  直接调用 require 方法
2.  执行 modules 对象对应的函数
    1.  调用 require.r 方法 标明该模块为 esModule
    2.  调用 require.d 方法 给 export 对象赋值
3.  返回 modules.exports

- ES6 modules 加载 ES6 modules

  1. 模块入口 调用 require.r 标明是 esModule 模块
  2. 调用 require 方法 加载模块
     1. 调用 require.r 标明被加载的模块是 esModule
     2. 调用 require.d 方法 给 export 对象赋值
  3. 返回 加载的内容 modules.exports

- ES6 modules 加载 common.js

  1. 模块入口 调用 require.r 标明是 esModule 模块、

  2. 调用 require 方法 加载模块 返回对应模块内容

  3. 兼容处理返回的默认值 调用 require.n

### **异步加载**

- 调用 require.e 异步加载代码，参数要加载的模块 ID

  - 创建一个空的 promises 数组
  - 调用 require.f.j(chunkId, promises）
    - 定义一个 promise 和并且将该 chunkId 对应 promise 的 resolve,reject 放进数组
    - 在全局对象 installedChunks 存取 key：chunkId ，value 为定义的数组
    - 将该 promise 添加到 promises 上
    - 通过 require.p + require.u(chunkId) 获取要动态加载的 script 的 url 地址
    - 调用 require.l 同过 JSONP（动态创建 script，成功后删除）异步加载对接的文件
    - 调用**webpackJsonpCallback**加载成功的回调，参数为 chunkIds 和 moreModules 对象
      - installedChunks 取出对应 chunkId 的 resolves 方法存起来
      - 把 installedChunks 中 chunkId 的值设置为 0 （表明该模块加载成功了）
      - 遍历 moreModules 合并模块定义到 modules 去
      - 依次取出 resolve 方法并执行
  - 返回 Promise.all(promises)

- 成功之后通过 then 方法加载调用 require 方法加载模块内容并返回下一个 then
- 页面通过.then 方法拿到结果
