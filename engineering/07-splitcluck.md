---
title: 7. SplitChunks
---

## 1. 代码分割

- 对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack 有一个功能就是将你的代码库分割成 chunks 语块，当代码运行到需要它们的时候再进行加载

## 2. 入口点分割

- Entry Points：入口文件设置的时候可以配置
- 这种方法的问题
  - 如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
{
  entry: {
   page1: "./src/page1.js",
   page2: "./src/page2.js"
  }
}
```

## 3 动态导入和懒加载

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个 chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用

### 3.1 normal

```js
document.querySelector("#play").addEventListener("click", () => {
  import("./video").then((result) => {
    console.log(result.default);
  });
});
```

### 3.2 prefetch(预先拉取)

- prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源
- 代码块的优先级位**最低**
- 实现原理： 当动态导入模块时候加了魔法注释`webpackPrefetch`，`webpack`打包工具会识别该魔法注释并把该模块做一个标识，在入口文件中会动态创建 link 标签，rel 为 prefetch，添加到 `document.head`中。

```js
button.addEventListener("click", () => {
  import(
    `./utils.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "utils" */
  ).then((result) => {
    result.default.log("hello");
  });
});
```

```html
<link rel="prefetch" href="utils.js" as="script" />
```

**实现**

```js
__webpack_require__.F.j = (chunkId) => {
  if ((!__webpack_require__.o(installedChunks, chunkId) || installedChunks[chunkId] === undefined) && true) {
    installedChunks[chunkId] = null;
    var link = document.createElement("link");
    if (__webpack_require__.nc) {
      link.setAttribute("nonce", __webpack_require__.nc);
    }
    link.rel = "prefetch";
    link.as = "script";
    link.href = __webpack_require__.p + __webpack_require__.u(chunkId);
    document.head.appendChild(link);
  }
};
```

### 3.3 preload(预先加载)

- preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件
- preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- preload 会把该资源的优先级设置位 高
- 实现原理： 当动态导入模块时候加了魔法注释`webpackPreload`，`webpack`打包工具会识别该魔法注释并把该模块做一个标识，webpack 紧紧是做了一个标识，要实现该功能需要借助第三方插件，该插件在编译的时候会动态读取这个标识，并且配合`html-webpack-plugin`插件直接将代码注入到 html 中，如果放在 main 中动态创建添加就太迟了，所以 webpack 本身没有实现。
- 通过 preload 表示过的优先级为高，mian.js 的优先级位低，prefetch 的优先级位最低，html 的优先级位最高

**其他**

- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
- 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 `Low`
- [link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
- [Support for webpackPrefetch and webpackPreload](https://github.com/jantimon/html-webpack-plugin/issues/1317)
- [preload-webpack-plugin](https://www.npmjs.com/package/@vue/preload-webpack-plugin)
- [webpackpreload-webpack-plugin](https://www.npmjs.com/package/webpackpreload-webpack-plugin)
- [ImportPlugin.js](https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/dependencies/ImportParserPlugin.js#L108-L121)

**webpackpreload-webpack-plugin**

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
class WebpackpreloadWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("PreloadWebpackPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap("PreloadWebpackPlugin", (htmlData) => {
        const { publicPath, assetTags } = htmlData;
        const { entrypoints, moduleGraph, chunkGraph } = compilation;
        for (const entrypoint of entrypoints) {
          const preloaded = entrypoint[1].getChildrenByOrders(moduleGraph, chunkGraph).preload; // is ChunkGroup[] | undefined
          if (!preloaded) return;
          const chunks = new Set();
          for (const group of preloaded) {
            for (const chunk of group.chunks) chunks.add(chunk);
          }
          const files = new Set();
          for (const chunk of chunks) {
            for (const file of chunk.files) files.add(file);
          }
          const links = [];
          for (const file of files) {
            links.push({
              tagName: "link",
              attributes: {
                rel: "preload",
                href: `${publicPath}${file}`,
              },
            });
          }
          assetTags.styles.unshift(...links);
        }
      });
    });
  }
}
module.exports = WebpackpreloadWebpackPlugin;
```

### 3.4 preload vs prefetch

- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源
- 而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源
- 所以建议：对于当前页面很有必要的资源使用 preload,对于可能在将来的页面中使用的资源使用 prefetch

## 4. 提取公共代码

1.  module chunk bundle

- module：就是 js 的模块化 webpack 支持 commonJS、ES6 等模块化规范，简单来说就是你通过 import 语句引入的代码
- chunk: chunk 是 webpack 根据功能拆分出来的，包含三种情况
  - 你的项目入口（entry）
  - 通过 import()动态引入的代码
  - 通过 splitChunks 拆分出来的代码
- bundle：bundle 是 webpack 打包之后的各个文件，一般就是和 chunk 是一对一的关系，bundle 就是对 chunk 进行编译压缩打包等处理之后的产出

2.  工作流程

- SplitChunksPlugi 先尝试把 minChunks 规则的模块抽取到单独的 Chunk 中
- 判断该 Chunk 是否满足 maxInitialRequests 配置项的要求
- 判断体积是否满足 minSize 的大小，如果小于 minSize 则不分包，如果大于 minSize 判断是否超过 maxSize,如果大于 maxSize 则继续拆分成更小的包

4.  webpack.config.js

- 请求数是指加载一个 Chunk 时所需要加载的所有的分包数量,包括 Initial Chunk，但不包括 Async Chunk 和 runtimeChunk
- maxInitialRequest 用于设置 Initial Chunk 最大并行请求数
- maxAsyncRequests 用于设置 Async Chunk 最大并行请求数
- 将 optimization.runtimeChunk 设置为 true 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
      chunks: "all",
      // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
      minSize: 0, //默认值是20000,生成的代码块的最小尺寸
      // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
      minChunks: 1,
      // 表示按需加载文件时，并行请求的最大数目。默认为5。
      maxAsyncRequests: 3,
      // 表示加载入口文件时，并行请求的最大数目。默认为3
      maxInitialRequests: 5,
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: "~",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        default: {
          minChunks: 2, ////被多少模块共享,在分割之前模块的被引用次数
          priority: -20,
        },
      },
    },
    runtimeChunk: true,
  },
};
```
