---
sidebar_position: 3
title: 3. sourcemap
---

## 1. sourcemap

### 1.1 什么是 sourceMap

- sourcemap 是为了解决开发代码与实际运行代码不一致时帮助我们 debug 到原始开发代码的技术
- webpack 通过配置可以自动给我们`source maps`文件，`map`文件是一种对应编译文件和源文件的方法

| sourcemap 类型                 | 适用场景                                 | 优缺点                                                     |
| :----------------------------- | :--------------------------------------- | :--------------------------------------------------------- |
| `source-map`                   | 原始代码，需要最好的 sourcemap 质量      | 最高的质量和最低的性能                                     |
| `eval-source-map`              | 原始代码，需要高质量的 sourcemap         | 高质量和低性能，sourcemap 可能会很慢                       |
| `cheap-module-eval-source-map` | 原始代码，需要高质量和低性能的 sourcemap | 高质量和更低的性能，只有每行的映射                         |
| `cheap-eval-source-map`        | 转换代码，需要行内 sourcemap             | 更高的质量和更低的性能，每个模块被 eval 执行               |
| `eval`                         | 生成代码，需要带 eval 的构建模式         | 最低的质量和更低的性能，但可以缓存 sourcemap               |
| `cheap-source-map`             | 转换代码，需要行内 sourcemap             | 没有列映射，从 loaders 生成的 sourcemap 没有被使用         |
| `cheap-module-source-map`      | 原始代码，需要只有行内的 sourcemap       | 没有列映射，但包括从 loaders 中生成的 sourcemap 的每行映射 |
| `hidden-source-map`            | 需要隐藏 sourcemap                       | 能够隐藏 sourcemap                                         |
| `nosources-source-map`         | 需要正确提示报错位置，但不暴露源码       | 能够正确提示报错位置，但不会暴露源码                       |

### 1.2 配置项

```js
 cosnt devtool =	\^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$\
```

- 配置项其实只是五个关键字 eval、source-map、cheap、module 和 inline 的组合

| sourcemap 类型 | 描述                                                                        |
| :------------- | :-------------------------------------------------------------------------- |
| `source-map`   | 生成 .map 文件 **最高的质量和最低的性能**                                   |
| `eval`         | 使用 eval 包裹模块代码，**有缓存**                                          |
| `cheap`        | 不包含列信息，也不包含 loader 的 sourcemap **(低开销)**                     |
| `module`       | 包含 loader 的 sourcemap，否则无法定义源文件 **映射到 loader 处理前的代码** |
| `inline`       | 将 .map **作为 DataURI 嵌入**，不单独生成 .map 文件                         |

### 1.3 最佳实践

#### 1.3.1 开发环境

- 开发环境对 sourceMap 的要求：快（eval），信息全（module），
- 且由于此时代码未压缩，我们并不那么在意代码列信息(cheap),
- **推荐配置**：`devtool: eval-cheap-module-source-map`

#### 1.3.2 生产环境

- 一般情况下，我们并不希望任何人都可以在浏览器直接看到我们未编译的源码，
- 所以我们不应该直接提供 sourceMap 给浏览器。但我们又需要 sourceMap 来定位我们的错误信息，
- **推荐**`hidden-source-map`
- 一方面 webpack 会生成 sourcemap 文件以提供给错误收集工具比如 sentry，另一方面又不会为 bundle 添加引用注释，以避免浏览器使用。

## 2.调试代码

### 2.1 测试环境调试

```js

- 把代码发布到了测试环境，不希望测试人员能看到你的源文件
- 但是你开发需要
- 你可以把 map 文件放在你的本地。
```

- `filemanager-webpack-plugin` 是一个用于 Webpack 的插件，可以在 Webpack 构建结束后执行一些文件管理操作比如拷贝文件、删除文件、归档文件等等
- `webpack.SourceMapDevToolPlugin `是 webpack 提供的用于生成 source map 的插件之一。它可以为开发环境下的代码生成 source map，方便调试和定位问题,该插件的主要作用就是在打包的代码中生成对应的 source map 文件
  - filename: 指定生成的 source map 文件名，一般为 [file].map 或者 [file].[contenthash].map
  - append: 是否将 source map 添加到已有的 source map 中，如果为 false，则生成的 source map 会覆盖已有的 source map

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FileManagerPlugin = require("filemanager-webpack-plugin")
const webpack = require("webpack")
module.exports = {
  mode: "production",
  devtool: false,
  entry: "./src/index.js",
  resolveLoader: {
    modules: ["node_modules", "loaders"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|bmp)$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.SourceMapDevToolPlugin({
      append: "\n//# sourceMappingURL=http://127.0.0.1:8081/[url]",
      filename: "[file].map[query]",
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: "./dist/*.map",
              destination: false,
              // destination: "D:/aprepare/webpacksource/sourcemap",
            },
          ],
          delete: ["./dist/*.map"],
          archive: [
            {
              source: "./dist",
              destination: "./dist/dist.zip",
            },
          ],
        },
      },
    }),
  ],
}
```

本地

```bash
http-server -c -1 -p 8081
```

### 2.2 生产环境调试

- 打开混淆代码
- 右键 -> 选择[Add source map]
- 输入本地 `sourceMap` 的地址（此处需要启用一个静态资源服务，可以使用 `http-server` 或者通过浏览器打开对应混淆代码的`.map`文件 ），完成。本地代码执行构建命令，注意需要打开 `sourceMap` 配置，编译产生出构建后的代码，此时构建后的结果会包含 `sourceMap` 文件。关联上 `sourceMap` 后，我们就可以看到 `sources -> page` 面板上的变化了

## **请说说 sourcemap 原理**

其工作原理是在编译后的代码中嵌入一个映射文件，其中包含了源代码的位置信息。当开发者在浏览器中进行调试时，调试工具可以使用 SourceMap 文件将编译后的代码映射回原始源代码。

具体来说，SourceMap 文件中包含了一些映射条目，每个条目表示编译后的代码的一行、一列和一个源文件的位置信息。这个源文件可以是原始源代码，也可以是另一个编译后的文件，如果是后者，SourceMap 文件将会嵌套引用其他 SourceMap 文件以完成映射。

当开发者在浏览器中调试代码时，调试工具可以解析这些映射条目，根据 SourceMap 文件将编译后的代码映射回原始源代码。这使得开发者可以在浏览器中进行调试，并可以查看原始源代码的位置、断点和调用栈信息。

总之，SourceMap 文件提供了一个可靠的机制，使得开发者可以更轻松地进行调试和错误排查，从而提高了开发效率和代码质量。
