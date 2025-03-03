---
sidebar_position: 5
title: webpack 面试题题
---

## Webpack 和 rollup 区别

- Webpack 的功能丰富，生态比 rollup 更加完善，基本所有可配置环节都做成了可配置，极度灵活，但也造成了学习成本高，配置复杂的缺点。而 rollup 使用起来简单，只需要针对处理加入不同的 plugins 即可。
- webpack 打包产物会加入处理代码，导致代码体积变大，rollup 基本只对代码进行转换和整合，打包之后产物更小巧。
- Rollup 是基于 es module 实现的，es module 的静态解析使得 rollup 原生支持 tree-shaking；webpack2 开始支持且消除效果不好，webpack5 支持更好的 tree-shaking。
- Rollup 不支持 hmr。

通过对比可以发现：

在开发应用时，我们要面对各种文件类型打包和代码优化需求，webpack 强大的可配置性和生态更具优势。

如果我们只是构建第三方库，对打包没有那么高的要求，rollup 小巧且配置简单，并且良好的 tree-shaking 支持更加适合

## module，chunk，bundle 

- module：在Webpack中，一个模块是指一个文件。Webpack会将所有文件都看成是模块，然后将其打包成一份JavaScript文件。Webpack将每个模块视为一个单独的个体，每个模块都可以有自己的依赖和输出。
- chunk：一个chunk是由多个模块组合而成的。当Webpack打包时，会根据各个模块之间的依赖关系将它们分配到不同的chunk中。一个chunk包含了多个模块，这些模块之间可以互相依赖，但是不同的chunk之间是不能有依赖关系的。
- bundle：bundle是Webpack打包后生成的文件，包含了多个chunk。一个bundle可以是一个或多个chunk的集合，通常是一个JavaScript文件，用于在浏览器中执行。一个bundle包含了所有的模块和它们之间的依赖关系。

## 优缺点

**Webpack的优点主要包括：**

1. **支持多种文件类型**的打包，包括JS、CSS、图片、字体等。
2. 可以通过**插件机制进行扩**展，满足不同项目的需求。
3. **支持代码分割，可以实现按需加载。**
4. **支持热更新**，可以提高开发效率。
5. **支持 Tree Shaking，可以移除未使用的代码**，减小文件体积。

**抛弃Webpack的原因可能包括：**

1. **配置复杂**。Webpack的配置相对复杂，需要深入了解其原理才能进行优化和调试。
2. 构**建速度慢**。在大型项目中，Webpack的构建速度可能会受到影响，特别是在开启多个Loader和Plugin时。
3. **体积较大**。Webpack本身的体积较大，可能会影响项目的启动速度和性能。

## 工作流

![image-20230327233826194](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230302105130.png)

#### **初始化参数：**

1. **初始化参数**：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象（命令行优先级高）

#### **开始编译**

1. 用上一步得到的参数**初始化 Compiler 对象**
   1. 初始化 options 参数和 hooks （` run: new SyncHook()`, //在开始编译之前调用...）
2. **加载**所有配置的**插件**：
   1. 在配置中找到 plugins 数组
   2. 遍历 plugins 执行每个插件的 apply 方法，并把 compiler 实例传进去（每个插件都有一个 apply 方法）
   3. 执行` compiler.hooks.run.tap`等方法注册事件
3. **执行**`compiler`实例的 **run 方法**开始执行编译
   1. 整个过程伴随着触发插件的注册个各种钩子函数` this.hooks.done.call()`...
   2. 开启一次新的编译，创建一个新的 Compilation 实例
   3. 执行实例的 build 方法，传入完成的回调

#### **编译模块**根据配置中的 entry 找出入口文件

1. 1. 格式化入口文件，变成对象形式
   2. 对入口进行遍历，获取入口文件的绝对路径，添加到文件依赖列表中

2. **loader 转换**：从入口文件出发,调用所有配置的 Loader 对模块进行转换 （最终返回 module 对象）

   1. 读取处理文件的内容

   2. 根据规则找到所有的匹配的 loader

   3. 调用所有配置的 Loader 对模块进行转换（从上到下，从右向左）

   4. 获取当前模块模块 id，相对于根目录的相对路径

   5. 创建一个 module 对象

      ```js
      const module = {
          id:'./src/entry1.js',//相对于根目录的相对路径
           dependencies:[{depModuleId:./src/title.js,depModulePath:'xxx'}],//dependencies就是此模块依赖的模块
          names:['entry1'],// name是模块所属的代码块的名称,如果一个模块属于多个代码块，那么name就是一个数组
      2.
           _source:'xxx',//存放对应的源码
      }
      ```

      

3. **编译模块分析依赖**，再**递归遍历**本步骤直到所有入口**依赖模块**的文件都经过了本步骤的处理

   1. 将 loader 编译后的代码调用 parse 转换为 ast
   2. 遍历语法树，如果存在 require 或者 import，说明就要依赖一个其它模块
   3. 获取依赖模块的绝对路径，添加到文件依赖列表中
   4. 获取此依赖的模块的 ID, 也就是相对于根目录的相对路径
   5. 修改语法树，把依赖的模块名换成模块 ID
   6. 把依赖的模块 ID 和依赖的模块路径放置到当前模块 module 的依赖数组中
   7. 调用 generator（ast），把转换后的源码放在 module._source 属性,用于后面写入文件
   8. 遍历`module.dependencies`，递归构建 module，构建好的存储到 this.modules 上，如果第二个入口也依赖该模块，直接取用，只需要给该模块的 name 属性上添加上入口信息

#### **输出资源**

1. **组装 chuck 对象：**

   1. 组装

   ```js
   const chuck = {
     name: "entry1", //入口名称
     entryModule, //入口的模块的module {id,name,dependencies,_source}
     modules: [{}], // 入口依赖模块的集合
   }
   ```

   

   1. `this.chunks.push(chunk)`

#### 生成 bundle 文件

1. 把每个 Chunk 转换成一个单独的文件加入到输出列表
   1. 获取要生成的文件名称并把文件名添加到 this.files 中
   2. 获取文件内容并给 this.assets 对象
   3. 执行 `compilation.build` 方法的回调

#### 写入文件

1. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统



## Loader

### 1.1 概念

- 所谓 loader 只是一个导出为函数的 JavaScript 模块。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
- compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

### 1.2 loader 类型

- [loader 的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)

### 1.3 特殊配置

```js
/**
 * Auto=Normal
 * !  noAuto 不要普通 loader
 * -! noPreAuto 不要前置和普通 loader
 * !! noPrePostAuto 不要前后置和普通 loader,只要内联 loader
 */
```

### 1.4 pitch

- 比如 `a!b!c!module`, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230307173454.png)

### 1.5 配置自定义 loader 有以下几种方式

1. 配置绝对路径

2. 配置 resolveLoader 中的 alias

3. 如果说 loader 很多，用 alias 一个一个配很麻烦，resolveLoader.modules 指定一个目录，找 loader 的时候会先去此目录下面找



## Plugin

`webpack`中的`plugin`也是如此，`plugin`赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期

### 特性

其本质是一个具有`apply`方法`javascript`对象

`apply` 方法会被 `webpack compiler `调用，并且在整个编译生命周期都可以访问 `compiler `对象

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

`compiler hook` 的 `tap `方法的第一个参数，应是驼峰式命名的插件名称

关于整个编译生命周期钩子，有如下：

- entry-option ：初始化 option
- run
- compile： 真正开始的编译，在创建 compilation 对象之前
- compilation ：生成好了 compilation 对象
- make 从 entry 开始递归分析依赖，准备对每个模块进行 build
- after-compile： 编译 build 过程结束
- emit ：在将内存中 assets 内容写到磁盘文件夹之前
- after-emit ：在将内存中 assets 内容写到磁盘文件夹之后
- done： 完成所有的编译过程
- failed： 编译失败的时候

### 常见的plugin

HtmlWebpackPlugin----在打包结束后，⾃动生成⼀个 `html` ⽂文件

clean-webpack-plugin------删除（清理）构建目录

mini-css-extract-plugin----提取 `CSS` 到一个单独的文件中

代码丑化的

## HMR

Webpack 实现热更新的原理是在开发环境中通过 Webpack Dev Server 创建一个 HTTP 服务器，将编译后的文件作为资源发布在服务器上，并且通过 Websocket 与客户端保持长连接，实时将编译后的文件推送给客户端，从而实现实时更新页面的效果。

---



- 通过`webpack-dev-server`创建两个服务器：提供静态资源的服务（express）和Socket服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的长连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest文件）和.js文件（update chunk）
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过HMR runtime机制，加载这两个文件，并且针对修改的模块进行更新

---



1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
7. 而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码

## 模块联邦

模块联邦是一个可以实现多个独立 Webpack 构建之间共享代码的技术，它的优点和缺点如下：

优点：

- 可以让不同团队开发的独立应用之**间共享代码，避免重复打包相同的模块，减少打包的体积，提高应用的性能。**
- 可以将应**用拆分成更小的模块，**提高应用的可维护性和可重用性，方便新增和修改功能。
- 可以在不同应用之间共享运行时状态，提高应用的运行效率和响应速度。

缺点：

- 需要对项目结构和打包方式进行重构，实现起来可能需要耗费一定的时间和精力。
- 多个应用之间共享代码的同时也带来了代码耦合度的增加，需要进行合理的管理和维护。
- 在调试和错误排查方面可能会增加一定的难度，需要对整个系统有较为深入的了解。

总的来说，模块联邦在多个独立应用之间共享代码方面具有显著的优势，但是需要权衡其带来的开发成本和管理维护的复杂度。

## tree shaking

- **ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块**
- 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

## splitClucks

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetPlugin = require('./asset-plugin');
module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        page1: "./src/page1.js",
        page2: "./src/page2.js",
        page3: "./src/page3.js",
    },
    optimization: {
        splitChunks: {
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: 'all',
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 0,//默认值是20000,生成的代码块的最小尺寸
            // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
            minChunks: 1,
            // 表示按需加载文件时，并行请求的最大数目。默认为5。
            maxAsyncRequests: 3,
            // 表示加载入口文件时，并行请求的最大数目。默认为3
            maxInitialRequests: 5,
            // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
            automaticNameDelimiter: '~',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/, //条件
                    priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                },
                default: {
                    minChunks: 2,////被多少模块共享,在分割之前模块的被引用次数
                    priority: -20
                },
            },
        },
        runtimeChunk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page1"],
            filename: 'page1.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page2"],
            filename: 'page2.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page3"],
            filename: 'page3.html'
        }),
        new AssetPlugin()
    ]
}
```



## Webpack 的优化

1. 减小文件体积：可以通过使用 Tree shaking、代码分割和压缩等方式来减小文件体积。
2. 加快构建速度：可以使用 Webpack 的缓存机制和多进程打包等方式来加快构建速度。
3. 优化模块分离：可以使用动态导入和公共代码分离等方式来优化模块分离。
4. 按需加载：可以使用按需加载来提高页面加载速度，减少不必要的请求和流量。
5. 优化静态资源加载：可以使用 CDN 加速和本地缓存等方式来优化静态资源加载。
6. 使用 Scope Hoisting：可以使用 Scope Hoisting 来减少模块数量，从而提高代码的运行效率。
7. 优化打包输出：可以使用分离 CSS、合并 JavaScript、添加版本号等方式来优化打包输出 mini-css-extract-plugin
8. 加快查找速度  alias  指定extension

## webpack5

- 持久化缓存
- 资源模块
- `moduleIds` & `chunkIds`的优化
- 更智能的`tree shaking`
- nodeJs的`polyfill`脚本被移除
- 支持生成`e6/es2015`的代码
- `SplitChunk`和模块大小
- `Module Federation`

## common.js 和 es6 

1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

3、CommonJs 是单个值导出，ES6 Module可以导出多个

4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层

5、CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined



## Webpack 和 Vite 区别

Webpack 是一个**高度可配置的静态模块打包工具**，它的主要思想是将所有的代**码资源视为一个个模块**，并通**过各种 loader 和 plugin 的组合进行处理和打包**。Webpack **打包的过程较为复杂，需要花费一定的时间和资源**，特别是在开发环境**下需要实时编译和刷新页面时，**Webpack 的**效率会更**低。但是**，Webpack 能够满足复杂项目的需求，且社区支持广泛，功能强大。**



Vite 是一**个基于浏览器原生 ES 模块导入的开发服务器。**Vite 的主要思想是**借助浏览器本身的原生模块支持**，将代码分割成更小的块，**在开发环境下不需要**打包，而是以 ESM 模块的方式直接提供给浏览器使用。这使得**开发环境下的启动和重新加载速度更快，尤其是对于大型项目**。Vite 只在开发环境下使用，生产环境下仍然需要使用其他工具进行打包。



## umi+dva

**Umi 是一款可扩展的企业级前端应用框架，它提供了丰富的插件和配置项**，能够快速地搭建起一个完整的前端工程。**它还集成了 Dva 数据流方案，**提供了一套完整的前端应用解决方案。因此，如果需要快速搭建一个企业级应用，**并且需要处理复杂的数据**流，那么使用 Umi 和 Dva 是一个不错的选择。

## **vite+mobx**

Vite 是一款新兴的前端构建工具，它具有**极快的启动和热重载速度，同时也支持按需加载，能够快速地提高前端**开发效率。而 **MobX 是一种简单而强大的状态管理库，它使用响应式编程的方式来处理应用状态**，能够使状态管理更加简单和高效。因此，如果需要快速搭建一个现代化的前端应用，并且需要处理大量的状态，那么使用 Vite 和 MobX 是一个不错的选择。


