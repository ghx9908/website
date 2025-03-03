---
sidebar_position: 4
title: node面试题
---

## node 中的事件环

**关键字**: 顺序 优先级 阻塞 老版本

- Node.js 的事件循环是基于事件驱动和非阻塞 I/O 的模型。

```js
本阶段执⾏已经被 setTimeout() 和 setInterval()的调度回调函数。
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
|          执⾏延迟到下⼀个循环迭代的 I/O 回调。
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
|         仅系统内部使⽤。
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
| 检索新的I/O事件;执⾏与 I/O相关的回调     ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
|   setImmediate() 回调函数在这⾥执⾏。  └───────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
|       ⼀些关闭的回调函数
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

- 微任务：`process.nextTick`、> `Promise.then`、

**流程**

- 代码执行时，首先处理同步代码，然后进入事件循环，
- **定时器阶段（timers phase）**：依次执行定时器回调、这个阶段处理 setTimeout 和 setInterval 的回调
- **轮询阶段（poll phase）**：
  - 检测 Poll 队列中是否为空，如果不为空则执⾏队列中的任务，直到超时或者全部执⾏完毕。
  - 执⾏完毕后检测 setImmediate 队列是否为空，如果不为空则执⾏ check 阶段，如果为空则等待时间到达。时间到达后回到 timer 阶段
  - 如果没有 I/O 操作且定时器尚未到期，则它可能会阻塞并等待。
- **检查阶段（check phase）** 在这一阶段执行 setImmediate 的回调函数
- 浏览器：每执行完毕一个宏任务，会清空微任务 从 node10+ 后执行机制和我们的浏览器一样 新的
- **以前的 node 事件环是每个阶段的宏任务都被清空了，才会执行微任务 老的**

## Koa 和 express 区别

### 1. **框架设计和体积**

- **Express**: 是一个全功能的 Web 框架，提供了很多开箱即用的功能，如路由、中间件、模板引擎等。它的目的是帮助开发者快速构建 Web 应用和 API。
- **Koa**: 是由 Express 团队开发的一个更加轻量的框架。它没有 Express 内置的一些功能（例如路由、模板引擎），核心只提供非常基础的功能。Koa 的设计理念是让开发者根据需求自己选择和引入中间件，打造更加灵活的应用。

### 2. **中间件机制**

- **Express**: 使用传统的回调函数形式来处理中间件。每个中间件通过 `next()` 来传递控制权给下一个中间件。中间件的执行顺序是线性执行的。
- **Koa**: 基于 `async/await` 的中间件机制，使用了更现代的 ES2017 特性。Koa 的中间件是“洋葱模型”，即中间件可以在 `await next()` 前后处理请求。这样做的好处是可以在请求前后分别执行逻辑，代码结构更加清晰和直观。

**例子:**

- Express 中的中间件：

  ```js
  app.use(function (req, res, next) {
    console.log("Request Type:", req.method)
    next()
  })
  ```

- Koa 中的中间件：

  ```js
  app.use(async (ctx, next) => {
    console.log("Request Type:", ctx.method)
    await next()
    console.log("Response Status:", ctx.status)
  })
  ```

### 3. **异步处理**

- **Express**: Express 早期是基于回调的，虽然后来可以使用 `async/await`，但并不是从底层为这种异步模式设计的。Express 的异步处理依然会依赖于 `next()`。
- **Koa**: 从一开始就基于 `async/await` 设计，异步操作更为自然和简洁。所有中间件都是通过 `async/await` 机制进行控制的，使得异步代码更加直观，避免了回调地狱。

### 4. **错误处理**

- Express: 错误处理中间件需要手动通过 `next(err)` 传递错误，或者使用 try-catch 包裹异步函数。

  ```js
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
  })
  ```

- Koa: 基于 `async/await`，Koa 内部通过 try-catch 自动捕获异步函数中的错误。开发者只需要在上层中间件处理即可，错误处理更加自然和优雅。

  ```js
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = "Internal Server Error"
    }
  })
  ```

### 5. **上下文对象**

- **Express**: 请求和响应是两个独立的对象（`req` 和 `res`）。开发者需要在中间件中频繁地使用这两个对象进行操作。
- **Koa**: 将请求和响应合并到了一个 `ctx`（context）对象中，简化了处理流程，所有与请求和响应相关的信息都挂在 `ctx` 上。开发者在处理时可以更加方便地进行操作。

### 6. **扩展性**

- **Express**: 提供了大量的内置中间件和插件，开箱即用，社区生态非常丰富。
- **Koa**: 由于 Koa 非常轻量，几乎所有功能都需要通过第三方中间件来实现，因此 Koa 应用的扩展性和自由度更高。开发者可以根据具体需求自行选择合适的中间件。

### 7. **性能**

- Koa 由于更加轻量、底层更少的依赖，理论上在处理请求时的性能要优于 Express。但在实际应用中，两者的性能差异并不会特别大，更多还是取决于使用场景和具体实现。

### 总结：

- **Express** 更加适合需要快速开发、追求稳定的项目，特别是对于小型项目或中型项目来说，Express 内置的功能可以极大提高开发效率。
- **Koa** 更加灵活、现代，适合追求极简和高度定制化的项目。对于大型项目或需要复杂中间件处理的场景，Koa 的“洋葱模型”会让中间件逻辑更加清晰明了。

## Express 中间件

Express 中间件是其核心功能之一，允许开发者在请求-响应的周期中拦截、修改、处理请求或响应。它的核心概念是以链式方式执行的函数，这些函数可以执行任务或将控制权交给下一个中间件。

### **Express 中间件的特点**：

1. **执行顺序**：按照注册顺序执行，类似于流水线。

2. **`next` 函数**：用于将控制权传递给下一个中间件函数，如果不调用 `next()`，请求就会被挂起，无法继续往下执行。

3. 三种类型的中间件：

   - 应用级中间件
   - 路由级中间件
   - 错误处理中间件

### **1. 应用级中间件**

应用级中间件通过 `app.use()` 或 `app.METHOD()` 绑定到应用程序对象上，针对所有路由或特定路径进行全局的请求处理。

```js
const express = require("express")
const app = express()

// 不指定路径的应用级中间件，作用于所有请求
app.use((req, res, next) => {
  console.log("Time:", Date.now())
  next() // 将控制权交给下一个中间件
})

// 绑定在特定路径上的中间件
app.use("/user/:id", (req, res, next) => {
  console.log("Request URL:", req.originalUrl)
  next()
})

app.get("/user/:id", (req, res) => {
  res.send("User Info")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
```

### **2. 路由级中间件**

路由级中间件与应用级类似，但它是通过 `express.Router()` 绑定在特定路由上的。路由级中间件允许我们对某个路由进行更加细粒度的控制。

```js
const express = require("express")
const router = express.Router()

// 路由级中间件
router.use((req, res, next) => {
  console.log("Router middleware triggered")
  next()
})

router.get("/profile", (req, res) => {
  res.send("User profile")
})

app.use("/user", router) // 绑定到 /user 路由上
```

### **3. 错误处理中间件**

错误处理中间件是专门用于处理应用中错误的中间件。与普通中间件不同，它有 4 个参数：`err, req, res, next`，用于捕获和处理错误。

```js
app.use((err, req, res, next) => {
  console.error(err.stack) // 输出错误堆栈信息
  res.status(500).send("Something went wrong!")
})
```

### **4. 内置中间件**

Express 提供了一些常用的内置中间件来处理静态文件、解析请求体等操作。

- **express.static**：用于服务静态文件。
- **express.json**：解析 `JSON` 格式的请求体。
- **express.urlencoded**：解析 `URL-encoded` 格式的请求体。

```js
app.use(express.json()) // 解析 application/json 格式的请求
app.use(express.urlencoded({ extended: true })) // 解析 application/x-www-form-urlencoded
app.use(express.static("public")) // 提供静态文件，如 HTML、CSS、图片等
```

### **5. 第三方中间件**

Express 生态中有大量的第三方中间件，可以帮助处理不同的功能，比如日志记录、权限认证、CORS 等。

- **morgan**：记录 HTTP 请求日志。
- **cors**：处理跨域请求。
- **helmet**：提升应用安全性。

```j's
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('combined')); // 日志记录
app.use(cors()); // 允许跨域
```

### **6. 中间件的执行流程**

Express 中间件的执行是串行的，每个中间件函数按照它们被注册的顺序依次执行。通过调用 `next()`，可以将控制权传递给下一个中间件。如果某个中间件没有调用 `next()`，请求-响应周期就会中止，响应会停滞在那个中间件上。

### **中间件控制流示例**：

```js
app.use((req, res, next) => {
  console.log("First middleware")
  next() // 将控制权传递给下一个中间件
})

app.use((req, res, next) => {
  console.log("Second middleware")
  res.send("Hello World") // 响应结束，不会进入下一个中间件
})

app.use((req, res, next) => {
  console.log("This will never run")
})
```

在这个例子中，由于第二个中间件结束了请求的生命周期，第三个中间件将永远不会被执行。

### **总结**：

- Express 中间件是请求-响应周期的核心，可以实现请求的预处理、日志记录、错误处理等功能。
- 中间件通过 `next()` 来传递控制权，形成一个执行链。
- Express 支持应用级、路由级、错误处理以及第三方中间件，使其具有高度扩展性和灵活性。

## Express

express 是一个**简单、灵活、功能丰富的 Web 框架**，它提供了一组强大的特性，使开发 Web 应用变得更加容易。

Express **支持各种 HTTP 请求方法和中间件，并提供了对模板引擎的支持**。由于它的简单性和易用性，Express 成为了 Node.js Web 开发的首选框架之一。

如果**应用场景比较简单，比如只是需要构建一个简单的 Web 应用或者 API，**使用 Express 就足够了。



## **Koa**

Koa 是一个**更加轻量级的 Web 框架，它是由 Express 原班人马打造的，可以说是 Express 的升级版**。Koa **使用了 ES6 的 async/await 特性和 Promise 来实现异步流程控制，**并通过**中间件的方式来提供强大的扩展性和灵活性**。相比于 Express，Koa **更加轻量级、更加灵活、更加易扩展，并且更加适合处理高并发的请求。**

如果**应用场景比较复杂，需要更高的灵活性和扩展性，或者需要处理高并发的请求**，那么我会选择使用 Koa。

## 底层机制和实现原理

1. **中间件机制：**中间件是 Express 和 Koa 中最核心的概念之一。它们**负责处理请求和响应，可以执行各种操作，如验证请求、设置响应头等**。

   **Express 的中间件是一个基于回调函数的栈结构**，**Koa 的中间件则是基于 async/await 的洋葱模型。**

2. **路由机制：**路由用于处理不同的 URL 请求，根据请求的路径和方法（GET、POST 等）调用相应的处理函数。Express 和 Koa 都支持路由机制，但实现方式略有不同。

3. 错误处理：错误处理是 Web 应用中必不可少的一部**分。Express 和 Koa 都提供了全局错误处理中间件来处理应用中的错误。**

4. 请求和响应对象的封装：**Express 和 Koa 都对 Node.js 原生的请求和响应对象进行了封装，使其更易于使用。**

5. 异步流程控制：在 Node.js 应用中，异步流程控制非常重要。**Express 和 Koa 都提供了基于回调函数和 async/await 的异步流程控制方案。**

## 性能问题

1. CPU 占用率过高：这可能是因为某些代码在不断地循环执行或者进行了大量的计算。解决方法可以是使用异步操作、使用缓存、对代码进行优化等。
2. 内存泄漏：这通常是由于不合理的内存管理或者代码中存在循环引用导致的。解决方法可以是使用内存管理工具、及时释放不需要的对象、检查代码中是否存在循环引用等。
3. 响应时间过长：这可能是由于请求处理时间过长或者网络延迟导致的。解决方法可以是优化请求处理代码、使用缓存、加入负载均衡等。
4. 并发量过大：当并发量过大时，可能会出现请求阻塞、内存溢出等问题。解决方法可以是使用集群、增加服务器数量、优化代码等。

在解决性能问题时，我们也可以使用一些工具和技术来帮助我们进行性能分析和调优。例如 Node.js 自带的性能分析工具、CPU 和内存监控工具、代码压缩和优化工具、缓存工具等。此外，也可以考虑使用一些第三方模块，如 pm2、heapdump、memory-usage 等来进行性能分析和优化。

## Node.js 的优势

我使用 Node.js 开发过一些Web应用、RESTful API服务和命令行工具。在我看来，使用 Node.js 的优势主要有以下几个方面：

1. 快速开发：Node.js 使用 JavaScript 作为开发语言，能够让前端开发人员快速转换到后端开发领域，从而快速构建Web应用和API服务。
2. 高效执行：Node.js 使用单线程、非阻塞I/O的事件驱动模型，能够高效地处理大量并发请求，从而提高应用的性能。
3. 强大的包管理工具：Node.js 的包管理工具 npm 提供了丰富的第三方模块，能够快速集成其他的库和工具，提高开发效率。
4. 跨平台支持：Node.js 提供了跨平台的支持，能够在各种操作系统上运行，同时还提供了丰富的系统级API，能够满足各种开发需求。

在我的应用开发经验中，我发现 Node.js 的高效执行和强大的包管理工具能够大大提高开发效率和应用性能，尤其适合于构建高并发、高性能的Web应用和API服务。

## 如何读取一个 20G 大小的文件

如果要读取一个 20G 大小的文件，可以使用 Node.js 提供的文件流（fs.createReadStream）来读取。这种方式可以避免一次性读取整个文件，而是通过一块一块的读取，降低内存的使用。以下是一个简单的示例代码：

```js
const fs = require('fs');

const readStream = fs.createReadStream('path/to/20G/file');

readStream.on('data', (chunk) => {
  // 处理读取的数据块
});

readStream.on('end', () => {
  // 文件读取完毕
});

readStream.on('error', (err) => {
  // 处理读取文件时发生的错误
});
```

可以通过监听 `data` 事件来获取每个数据块，并对其进行处理。监听 `end` 事件可以在文件读取完毕后执行相应的操作，比如关闭文件流等。监听 `error` 事件可以处理读取文件时发生的错误，比如文件不存在、读取权限等问题。
