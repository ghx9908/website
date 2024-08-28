---
sidebar_position: 1
title: 1. webpack的使用
---

## 1.什么是 webpack？

### 1.1 webpack

- Webpack 是一个现代的 JavaScript 应用程序静态模块打包器（module bundler），它将许多文件视为一个整体，通过分析模块之间的依赖关系，最终将它们打包成一个或多个静态资源文件，如 JavaScript、CSS、图片
- Webpack 可以实现以下功能
  - 代码转换：将 ES6、TypeScript 等高级语言转换为浏览器可识别的低级语言
  - 文件优化：通过代码压缩、图片压缩、文件合并等方式来减小文件体积，加快页面加载速度
  - 模块合并：将多个模块合并为一个文件，减少 HTTP 请求的数量
  - 依赖管理：通过分析模块之间的依赖关系，自动加载所需的依赖模块
  - 插件扩展：通过插件扩展功能，满足不同项目的需求

### 1.2 webpack-cli

- webpack-cli 是 Webpack 官方提供的一个命令行工具，用于在终端中执行 Webpack 打包操作
- Webpack-cli 命令行工具提供了多种指令，可以用于打包、编译、生成配置文件、构建多页应用等

### 1.3 安装

```js
npm install webpack webpack-cli  webpack-dev-server style-loader css-loader html-webpack-plugin cross-env mini-css-extract-plugin less less-loader postcss postcss-loader autoprefixer @babel/core @babel/preset-env babel-loader typescript ts-loader @babel/preset-typescript  eslint eslint-webpack-plugin eslint-config-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node @typescript-eslint/eslint-plugin --save
```

## 2. webpack 打包

### 2.1 entry

- `entry` 选项用于指定 Webpack 打包的入口文件，即告诉 Webpack 从哪个文件开始打包

- ```
  entry
  ```

  可以配置为一个字符串、一个数组或一个对象

  - 如果 entry 配置为一个字符串，表示入口文件是一个单独的文件，Webpack 将以该文件作为入口打包所有依赖的模块
  - 如果 entry 配置为一个数组，表示入口文件有多个，Webpack 将以数组中的文件作为入口打包所有依赖的模块
  - 如果 entry 配置为一个对象，表示入口文件有多个且需要命名，Webpack 将根据对象中的键名生成多个入口文件

#### 2.1.1 webpack.config.js

webpack.config.js

```js
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  /*
  entry: ['./src/entry1.js','./src/entry2.js'],
  entry:{
    app: './src/index.js',
  }
  */
}
```

#### 2.1.2 package.json

package.json

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

#### 2.1.3 src\index.js

src\index.js

```js
console.log("index")
```

### 2.2 output

- `output` 选项用于指定 Webpack 打包后输出的文件和路径，即告诉 Webpack 打包后的文件应该放在哪个目录下以及如何命名

- ```
  output
  ```

  通常配置为一个对象，包含了多个属性

  - `path` 指定了打包文件的输出路径，必须是一个绝对路径
  - `filename` 指定了打包后的文件名，可以包含路径信息

#### 2.2.1 webpack.config.js

webpack.config.js

```diff
+const path = require('path');
module.exports = {
  mode:'development',
  devtool:false,
  entry: './src/index.js',
+ output: {
+     path: path.resolve(__dirname, 'dist'),
+     filename: 'main.js'
+ }
};
```

### 2.3 loader

- Webpack 中的 Loader（加载器）用于对模块进行转换
- Webpack 将一切文件视为模块，但只有 JS 模块才能被直接运行和使用
- Loader 可以将非 JS 模块（如 CSS、图片等）转换为 Webpack 可以处理的有效模块

#### 2.3.1 src\index.js

src\index.js

```diff
+import './index.css';
console.log('index');
```

#### 2.3.2 src\index.css

src\index.css

```css
body {
  color: red;
}
```

#### 2.3.3 webpack.config.js

- 使用 Loader 需要在 Webpack 配置文件中定义 Loader 规则
- 每个 Loader 规则由两部分组成：匹配条件和处理方式
- 匹配条件通常使用正则表达式，用于匹配需要被转换的文件
- 处理方式则是具体的转换操作
- `test` 属性指定了匹配的文件类型
- `use` 属性指定了转换方式
- `exclude`用于指定哪些文件或目录不应该被 loader 处理
- `css-loader`作用是将 CSS 代码转换为 JavaScript 代码
- `css-loader` 可以识别 `@import` 和 `url()` 等语句，实现 CSS 模块的引用和解析
- `style-loader`最终通过`style`标签动态插入到`HTML`中
- `style-loader` 用于将 `css-loader` 转换后的 JavaScript 对象，以 `style` 标签的形式动态插入到 HTML 文件中

```diff
const path = require('path');
module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
  },
+ module: {
+   rules: [
+     { test: /\.css$/, use: ['style-loader','css-loader']}
+   ]
+ }
};
```

### 2.4 插件

- 插件是一种用于扩展 Webpack 功能的机制，通过插件可以在 Webpack 打包过程中执行额外的任务或进行优化
- `html-webpack-plugin` 是 Webpack 中用于生成 HTML 文件的插件，可以根据模板生成 HTML 文件，并自动将打包后的 JS、CSS 文件引入 HTML 文件中
- `title` 指定了 HTML 文件的标题
- `template` 指定了 HTML 文件的模板路径，即使用该模板生成 HTML 文件

#### 2.4.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
+const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader','css-loader']}
    ]
  },
+ plugins: [
+   new HtmlWebpackPlugin({template: './src/index.html'})
+ ]
};
```

#### 2.4.2 src\index.html

src\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack</title>
  </head>
  <body></body>
</html>
```

### 2.5 webpack-dev-server

- ```
  webpack-dev-server
  ```

  是一个基于

  ```
  Express
  ```

  的

  ```
  Web
  ```

  服务器，它可以为

  ```
  Webpack
  ```

  打包后的代码提供一个本地开发环境，支持实时刷新、热替换和自动构建等功能，大大提高了开发效率

  - `static`：静态资源目录的路径，设置该参数可以在服务器中访问这些静态资源
  - `compress`：启用 gzip 压缩，默认是关闭的
  - `port`：服务器端口，默认是 8080
  - `host`：服务器主机名，默认是 localhost
  - `open`：是否自动在浏览器中打开页面，默认是关闭的
  - `hot`：启用模块热替换功能，默认是关闭的
  - `watchFiles`：需要监听的文件列表，当这些文件发生变化时，自动重启服务器
  - `historyApiFallback`：参数用于设置是否启用 HTML5 历史记录 API，用于处理单页应用的路由问题。默认情况下，当使用浏览器的前进/后退按钮时，devServer 会尝试根据 URL 路径查找对应的静态资源，如果找不到就返回 404。如果启用了 historyApiFallback，则会将这些请求重定向到 index.html，然后交给前端路由来处理

- 在命令行中运行 `webpack-dev-server` 命令后，`webpack-dev-server` 将会启动一个本地 Web 服务器，并监听我们定义的端口。我们可以在浏览器中访问 `http://localhost:9000`，即可预览打包后的页面，并实现实时刷新和热替换功能

#### 2.5.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
  },
+ devServer: {
+   static: path.join(__dirname, 'public'),
+   compress: true,
+   host:'localhost',
+   port: 9000,
+   open:true,
+   hot:true,
+   historyApiFallback: true,
+   watchFiles: [
+     "src/**/*.js",
+     "src/**/*.css"
+   ]
+ },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader','css-loader']}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

#### 2.5.2 package.json

package.json

```diff
{
  "scripts": {
    "build": "webpack",
+   "dev": "webpack serve"
  }
}
```

## 3. 处理 CSS 资源

- `css-loader` 可以将 CSS 文件中的样式代码转换成 JavaScript 对象，并在 JavaScript 中导出，以便于其他 Loader 或插件进行处理。css-loader 支持使用 `import` 和 `url()` 等方式导入 CSS 文件和资源文件
- `style-loader` 可以将 CSS 样式注入到 Webpack 打包后的 JavaScript 文件中，使得页面能够正确显示样式。它会将 CSS 样式代码插入到页面的 `style` 标签中，或以内联样式的方式插入到 `head` 标签中
- `mini-css-extract-plugin` 当我们使用 `style-loader` 将 CSS 样式注入到 JavaScript 文件中时，每次页面加载都会将样式代码包含在 JavaScript 文件中，造成 JavaScript 文件变大，加载速度变慢，降低了页面的性能,为了解决这个问题，可以使用 `mini-css-extract-plugin` 插件，将 CSS 文件单独提取出来，生成独立的 CSS 文件，可以在页面加载时并行加载 CSS 文件，避免了 JavaScript 文件变大、加载缓慢的问题。此外，使用独立的 CSS 文件也可以让样式代码和 JavaScript 代码分离，方便维护和修改，提高开发效率

### 3.1 package.json

package.json

```diff
{
  "scripts": {
+   "build": "cross-env NODE_ENV=production  webpack",
+   "dev": "cross-env NODE_ENV=development  webpack serve"
  }
}
```

### 3.2 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode:'development',
  devtool:false,
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { test: /\.css$/, use: [
+       (process.env.NODE_ENV === 'development' ?
+         'style-loader' :
+         MiniCssExtractPlugin.loader)
        ,'css-loader']}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
+   new MiniCssExtractPlugin(),
  ]
};
```

## 4. 使用预处理器

- `less` 是一种基于 CSS 的扩展语言，它提供了更多的功能，比如变量、嵌套规则、运算、混合等等。Less 的代码可以转换为标准的 CSS 代码，从而可以在浏览器中直接使用
- `less-loader` 是一个 Webpack 的 loader，它可以将 Less 代码转换为标准的 CSS 代码。在 Webpack 配置文件中，通过配置 Less-loader 可以让 Webpack 在构建项目时自动将 Less 代码转换为 CSS 代码
- `sass` 是一种基于 CSS 的扩展语言，它提供了更多的功能，比如变量、嵌套规则、运算、混合等等。Sass 的代码可以转换为标准的 CSS 代码，从而可以在浏览器中直接使用
- `sass-loader` 是一个 Webpack 的 loader，它可以将 Sass 代码转换为标准的 CSS 代码。在 Webpack 配置文件中，通过配置 Sass-loader 可以让 Webpack 在构建项目时自动将 Sass 代码转换为 CSS 代码
- `stylus` 是一种基于 CSS 的扩展语言，它提供了更多的功能，比如变量、嵌套规则、运算、混合等等。Stylus 的代码可以转换为标准的 CSS 代码，从而可以在浏览器中直接使用
- `Stylus-loader` 是一个 Webpack 的 loader，它可以将 Stylus 代码转换为标准的 CSS 代码。在 Webpack 配置文件中，通过配置 Stylus-loader 可以让 Webpack 在构建项目时自动将 Stylus 代码转换为 CSS 代码

### 4.1 src\index.js

src\index.js

```diff
import './index.css';
+import './index.less';
console.log('index');
```

### 4.2 src\index.less

src\index.less

```less
@color: red;
body {
  color: @color;
}
```

### 4.3 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.css$/, use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
           'css-loader']
      },
+     {
+       test: /\.less$/, use: [
+         (process.env.NODE_ENV === 'development' ?
+           'style-loader' :
+           MiniCssExtractPlugin.loader),
+         'css-loader',
+         'less-loader'
+       ]
+     }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ]
};
```

## 5. PostCSS

- `PostCSS` 是一个使用 JavaScript 插件转换 CSS 的工具。它可以帮助我们自动处理浏览器前缀、使用未来的 CSS 语法等问题

- `PostCSS` 将 CSS 解析成 AST（抽象语法树），然后使用插件对 AST 进行处理，最后将处理后的 AST 转换为 CSS 代码

- [autoprefixer](https://github.com/postcss/autoprefixer) 是 PostCSS 的一个插件，它可以根据指定的浏览器版本自动添加所需的浏览器前缀。通过使用 autoprefixer，我们可以避免手动添加浏览器前缀的麻烦，同时也可以确保项目在各个浏览器中正确地显示

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 是 PostCSS 的一个插件集合，它可以让我们使用未来的 CSS 语法，而不需要等待浏览器支持。postcss-preset-env 包含了一些常用的 CSS 预处理器的语法，如 Sass 和 Less，以及一些未来的 CSS 语法，如 CSS Grid、CSS Variables 等

- [postcss-less](https://github.com/shellscape/postcss-less) 是 PostCSS 的一个插件，它可以让我们使用 Less 预处理器的语法，从而可以更方便地编写 CSS 代码。通过使用 postcss-less，我们可以在 Webpack 构建项目时自动将 Less 代码转换为标准的 CSS 代码

- [stylelint](https://github.com/stylelint/stylelint) 是一个强大的 CSS 校验工具，它可以帮助我们检查 CSS 代码是否符合一定的规范和最佳实践

- ```
  browserslistrc
  ```

  是一个文件，它用于指定当前项目需要支持的浏览器范围

  - `last 2 versions`：表示需要支持最近两个版本的所有浏览器
  - `> 1%`：表示需要支持全球使用率超过 1% 的浏览器
  - `iOS 7`：表示需要支持 iOS 7 版本的 Safari 浏览器
  - `last 3 iOS versions`：表示需要支持最近三个版本的 iOS Safari 浏览器

### 5.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
            'css-loader',
+           "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
+         "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ]
};
```

### 5.2 postcss.config.js

postcss.config.js

```js
module.exports = {
  plugins: [require("autoprefixer")],
}
```

### 5.3 .browserslistrc

.browserslistrc

```js
# Browsers that we support

last 2 versions
> 1%
iOS 7
last 3 iOS versions
```

## 6. Babel

- ECMAScript6.0 是 JavaScript 的一种标准化规范,ES6 引入了许多新特性，为 JavaScript 开发带来了巨大的改善和进步
- Babel 是一个开源 JavaScript 转编译器，它能将高版本如 ES6 代码等价转译为向后兼容，能直接在旧版 JavaScript 引擎运行的低版本代码
- `@babel/preset-env`是 Babel 的一个预设，用于自动检测目标环境并根据需要转换 JavaScript 代码
- `@babel/preset-env` 会根据配置的目标环境，自动检测当前代码中使用的 ECMAScript 特性，并通过转换、降级或添加 polyfill 来保证代码在目标环境中能够正常运行
- `@babel/preset-env` 的配置非常灵活，可以通过 `.babelrc`、`babel.config.js`、Webpack 配置等多种方式来指定需要支持的目标环境
- `babel-preset-react`是 Babel 的一个规则集，包含了常用的 React 插件，例如支持 `preset-flow`、`syntax-jsx` 和 `transform-react-jsx` 等插件
- `@babel/preset-typescript` 是 Babel 的一个规则集，用于将 TypeScript 代码转译为 JavaScript 代码
- `@babel/preset-flow` 是 Babel 的一个规则集，用于将 Flow 代码转译为 JavaScript 代码

### 6.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
+           loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ]
};
```

### 6.2 .babelrc

.babelrc

```js
{
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "ie": "11"
          }
        }
      ]
    ]
  }
```

### 6.3 src\index.js

src\index.js

```js
let sum = (a, b) => a + b
console.log(sum(1, 2))
```

## 7. TypeScript

- TypeScript 是一种由微软开发的开源编程语言，它是 JavaScript 的超集，扩展了 JavaScript 的语法和功能，提供了类型检查和面向对象编程等特性
- `resolve.extensions` 是 Webpack 配置中的一个选项，用于配置在导入模块时可以省略的后缀名,在模块导入时，`Webpack`会按照指定的后缀名顺序依次尝试加载文件，直到找到匹配的文件为止

### 7.1 ts-loader

- `ts-loader` 是 Webpack 中的一个加载器，用于将 TypeScript 代码转换成 JavaScript 代码。它是基于 typescript 编译器实现的，支持所有 TypeScript 的语法和特性，可以帮助开发者在 Webpack 中使用 TypeScript 进行开发

#### 7.1.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
+ entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
+ resolve: {
+   extensions: ['.ts', '.js'],
+ },
  module: {
    rules: [
+     {
+       test: /\.ts$/,
+       use: 'ts-loader',
+       exclude: /node_modules/
+     },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ]
};
```

#### 7.1.2 tsconfig.json

tsconfig.json

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "moduleResolution": "node"
  }
}
```

#### 7.1.3 src\index.ts

src\index.ts

```js

```

### 7.2 babel-loader

- `@babel/preset-typescript` 是 Babel 的一个预设，用于将 TypeScript 代码转换为 JavaScript 代码

#### 7.2.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
+       [
+         {
+           loader: 'babel-loader',
+           options: {
+             presets: ['@babel/preset-typescript']
+           }
+         }
+       ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ]
};
```

## 8. ESLint

- ESLint 是一个流行的 JavaScript 代码检查工具，旨在帮助前端开发者在编写代码时自动检查代码风格和语法错误。为了满足不同团队和项目的代码规范需求，ESLint 生态中出现了许多基于不同代码规范的规则集合和插件
- `eslint-config-airbnb` 是 Airbnb 提供的代码风格规则集，它是 ESLint 生态第一个成名的规则集合之一。它的优点在于提供了一套完整的、可自定义的代码规范，旨在帮助开发者编写具有一致性和可读性的代码
- `eslint-config-standard`遵循 Standard.js 代码风格规范，提供了最便捷的统一代码风格的方式。使用该规则集可以避免因代码风格不一致而引起的错误和混乱
- `eslint-plugin-vue`和`eslint-plugin-react`插件来实现对 SFC 文件和 React 代码风格的检查
- 针对 TypeScript 代码的检查，可以使用`@typescript-eslint/eslint-plugin`插件来检查代码风格和语法错误
- `eslint-plugin-sonarjs`插件，该插件基于`Sonar`提供了代码质量检查工具，提供圈复杂度、代码重复率等检测功能

### 8.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
+const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
        [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
+   new ESLintPlugin({ extensions: ['.js', '.ts'] })
  ]
};
```

### 8.2 .eslintrc

.eslintrc

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["plugin:@typescript-eslint/recommended"]
}
```

### 8.3 src\index.ts

src\index.ts

```js
let sum = (a: number, b: number) => a + b
console.log(sum(1, 2))
```

## 9.图像

### 9.1 asset-modules

- `module.rules.type`用于指定加载器的类型，也就是告诉 Webpack 该如何处理不同类型的文件

- [asset-modules](https://webpack.js.org/guides/asset-modules/)

- 在默认情况下，使用`asset/resource`类型的加载器会生成带有`[hash][ext][query]`后缀的文件名。如果需要自定义文件名，可以通过设置`output.assetModuleFilename`属性进行控制

- `module.rules.parser.dataUrlCondition`用于限制文件大小的阈值

- ```
  Asset Modules
  ```

  类型通过添加 4 种新的模块类型替代了所有这些加载器

  - `asset/resource` 生成单独的文件并导出 URL
  - `asset/inline` 导出资产的数据 URI
  - `asset/source` 导出资产的源代码
  - `asset` 会自动选择导出数据 URI 还是生成单独的文件,可以设置文件大小限制来实现

### 9.2 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
          [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript']
              }
            }
          ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
            (process.env.NODE_ENV === 'development' ?
              'style-loader' :
              MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      },
+     {
+       test: /\.(png)$/,
+       type: 'asset/resource'
+     },
+     {
+       test: /\.(jpg)$/,
+       type: "asset/inline"
+     },
+     {
+       test: /\.(bmp)$/,
+       type: "asset",
+       parser: {
+         dataUrlCondition: {
+           maxSize: 1024
+         }
+       }
+     },
      {
        test: /\.svg$/i,
       type: "asset/source"
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
    new ESLintPlugin({ extensions: ['.js', '.ts'] })
  ]
};
```

### 9.2 压缩图片

- image-webpack-loader 可以在 Webpack 打包过程中对图片进行优化和压缩，从而减小图片文件的大小，提高页面加载速度和响应速度

- 它的底层依赖于 imagemin 和一系列的图像优化工具，包括

  ```
  mozjpeg
  ```

  、

  ```
  optipng
  ```

  、

  ```
  pngquant
  ```

  、

  ```
  svgo
  ```

  、

  ```
  gifsicle
  ```

  和

  ```
  webp
  ```

  等，可以自动选择最优的优化工具对图片进行处理

  - optipng：用于压缩 PNG 图片的配置项
  - pngquant：同样用于压缩 PNG 图片的配置项，可以设置图片质量和压缩速度
  - svgo：用于压缩 SVG 图片的配置项，包含多个插件
  - gifsicle：用于压缩 Gif 图片的配置项
  - webp：用于将 JPG/PNG 图片压缩并转换为 WebP 图片格式的配置项

#### 9.2.1 安装

```js
cnpm install image-webpack-loader --save
```

#### 9.2.2 webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
          [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript']
              }
            }
          ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
            (process.env.NODE_ENV === 'development' ?
              'style-loader' :
              MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      },
      {
        test: /\.(png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(jpg)$/,
        type: "asset/inline"
      },
      {
        test: /\.(bmp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        }
      },
      {
        test: /\.svg$/i,
       type: "asset/source"
      },
+     {
+       // 匹配文件的正则表达式，这里表示匹配JPG、PNG、GIF和SVG格式的图片文件
+       test: /\.(jpe?g|png|gif|svg)$/i,
+       use: [
+         {
+            // 使用image-webpack-loader对图片进行优化和压缩
+           loader: 'image-webpack-loader',
+           options: {
+             // 是否禁用图片优化和压缩
+             disable: process.env.NODE_ENV === 'development',
+             mozjpeg: {
+               progressive: true, // 是否开启渐进式JPEG，可以有效提升JPEG图片加载速度
+               quality: 65 // 压缩JPEG图片的质量，取值范围为0到100，值越大质量越好但文件越大
+             },
+             optipng: {
+               enabled: true // 是否开启PNG图片的优化，可以有效提升PNG图片加载速度
+             },
+             pngquant: {
+               // 压缩PNG图片的质量范围，取值范围为0到1，值越大质量越好但文件越大
+               // 第一个数字表示压缩质量的下限，第二个数字表示压缩质量的上限
+               quality: [0.65, 0.9],
+               speed: 4 // 压缩PNG图片的速度，取值范围为1到10，值越大速度越快但质量越低
+             },
+             svgo: {
+               plugins: [ // 压缩SVG图片的插件列表，这里包含removeViewBox和cleanupIDs两个插件
+                 { //用于删除SVG图片中的viewBox属性
+                   //viewBox属性是用来指定SVG视口范围的，它的值是一个矩形框的坐标和宽高
+                   removeViewBox: false
+                 },
+                 { //用于删除SVG图片中的无用ID属性
+                   cleanupIDs: true
+                 }
+               ]
+             },
+             gifsicle: {
+               interlaced: true // 是否开启GIF图片的隔行扫描,可以有效提升GIF图片加载速度
+             }
+           }
+         }
+       ]
+     }
   ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
    //new ESLintPlugin({ extensions: ['.js', '.ts'] })
  ]
};
```

### 9.3 响应式图片

- 响应式图片是指能够根据设备屏幕大小和分辨率等因素动态调整显示大小和清晰度的图片

- 在不同设备上显示同一张图片时，响应式图片可以自动选择最优的图片版本，从而保证图片显示效果的一致性和优化网站性能

- ```
  responsive-loader
  ```

  是一个 webpack 的 loader，用于实现响应式图片的功能。它可以根据设备屏幕大小和像素密度等因素自动调整图片大小和清晰度，从而提高网站的用户体验和性能

  - sizes：用于指定不同尺寸的图片大小。在这个例子中，我们指定了 4 个不同的图片大小，分别是 300px、600px、1200px 和 2000px。当加载图片时，responsive-loader 会根据设备的屏幕大小和像素密度等因素自动选择最合适的图片大小
  - adapter：用于指定图片处理库。在这个例子中，我们使用了 sharp 库，它是一个高性能的图片处理库，可以用来自动调整图片大小和清晰度

- srcset 和 sizes 是 HTML 中 img 标签的两个属性，用于实现响应式图片的功能，可以根据设备屏幕大小和像素密度等因素自动选择最合适的图片版本和显示大小，从而提高网站的用户体验和性能

- srcset 属性用于指定不同尺寸和清晰度的图片版本，它的值是一个以逗号分隔的图片列表，每个图片元素包含了图片 URL 和对应的宽度或像素密度等信息

- sizes 属性用于指定图片在不同屏幕尺寸下的显示大小，它的值是一个以逗号分隔的尺寸列表，每个尺寸元素包含了媒体查询和对应的尺寸信息

- 浏览器加载这个 img 标签时，它会根据设备的屏幕大小和像素密度等因素，选择最合适的图片版本，并根据 sizes 属性指定的尺寸大小进行显示

#### 9.3.1 安装

```js
cnpm i responsive-loader sharp --save
```

#### 9.3.2 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
          [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript']
              }
            }
          ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
            (process.env.NODE_ENV === 'development' ?
              'style-loader' :
              MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      },
/*       {
        test: /\.(png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(jpg)$/,
        type: "asset/inline"
      },
      {
        test: /\.(bmp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        }
      },
      {
        test: /\.svg$/i,
       type: "asset/source"
      },
      {
        // 匹配文件的正则表达式，这里表示匹配JPG、PNG、GIF和SVG格式的图片文件
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
             // 使用image-webpack-loader对图片进行优化和压缩
            loader: 'image-webpack-loader',
            options: {
              // 是否禁用图片优化和压缩
              disable: process.env.NODE_ENV === 'development',
              mozjpeg: {
                progressive: true, // 是否开启渐进式JPEG，可以有效提升JPEG图片加载速度
                quality: 65 // 压缩JPEG图片的质量，取值范围为0到100，值越大质量越好但文件越大
              },
              optipng: {
                enabled: true // 是否开启PNG图片的优化，可以有效提升PNG图片加载速度
              },
              pngquant: {
                // 压缩PNG图片的质量范围，取值范围为0到1，值越大质量越好但文件越大
                // 第一个数字表示压缩质量的下限，第二个数字表示压缩质量的上限
                quality: [0.65, 0.9],
                speed: 4 // 压缩PNG图片的速度，取值范围为1到10，值越大速度越快但质量越低
              },
              svgo: {
                plugins: [ // 压缩SVG图片的插件列表，这里包含removeViewBox和cleanupIDs两个插件
                  { //用于删除SVG图片中的viewBox属性
                    //viewBox属性是用来指定SVG视口范围的，它的值是一个矩形框的坐标和宽高
                    removeViewBox: false
                  },
                  { //用于删除SVG图片中的无用ID属性
                    cleanupIDs: true
                  }
                ]
              },
              gifsicle: {
                interlaced: true // 是否开启GIF图片的隔行扫描,可以有效提升GIF图片加载速度
              }
            }
          }
        ]
      }, */
+     {
+                test: /\.(jpe?g|png)$/i,
+               //oneOf是一个优化选项，用于提高打包的速度
+               oneOf:[
+                   {
+                       //resourceQuery是一个用于匹配请求资源的URL中查询字符中
+                       resourceQuery:/sizes/,
+                       use:[
+                           {
+                            loader:'responsive-loader',
+                            options:{
+                               sizes:[300,600,1024],
+                               adapter:require('responsive-loader/sharp')
+                            }
+                           }
+                        ]
+                   },
+                   {
+                       type: 'asset/resource',
+                   }
+               ]
+           }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
    //new ESLintPlugin({ extensions: ['.js', '.ts'] })
  ]
};
```

#### 9.3.2 src\index.js

src\index.js

```js
import responsiveImg from "./images/bg.png?sizes[]=300,sizes[]=600,sizes[]=1024"
console.log(bg)
let image = new Image()
image.srcset = responsiveImg.srcSet
image.sizes = `(min-width: 1024) 1024px,100vw`
document.body.appendChild(image)
```

### 9.4 雪碧图

- 雪碧图（Sprite）是指将多个小图片（如图标、小按钮等）合并成一张大图片，通过 CSS 的 background-position 属性来控制显示不同的小图片。它的优点是减少 HTTP 请求次数，提高页面的加载速度和性能
- `webpack-spritesmith`是一个 webpack 插件，用于生成雪碧图。它可以将多个小图片合并成一张大图片，并在生成的 CSS 文件中自动生成 background-position 属性和样式代码，简化了雪碧图的生成和使用过程
- `resourceQuery`是一个用于匹配资源请求 URL 的查询字符串。它可以用于在 webpack 中对不同资源做不同的处理
- `oneOf`是一个用于优化打包速度的属性。通常情况下，webpack 会按照配置中的 loader 顺序依次尝试处理模块，直到找到能够处理该模块的 loader，这个过程会花费一定的时间，影响打包速度。而使用 oneOf 可以让 webpack 只尝试一次匹配，并使用第一个匹配成功的 loader 来处理模块，从而提升打包速度

#### 9.4.1 webpack.config.js

webpack.config.js

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:
          [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript']
              }
            }
          ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/, use:
          [
            (process.env.NODE_ENV === 'development' ?
              'style-loader' :
              MiniCssExtractPlugin.loader),
            'css-loader',
            "postcss-loader"
          ]
      },
      {
        test: /\.less$/,
        use: [
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          "postcss-loader",
+         {
+             loader:'less-loader',
+             options:{
+                 lessOptions:{
+                     paths:[
+                         path.resolve(__dirname,'src/spritesmith-generated')
+                     ]
+                 }
+             }
+         }
        ]
      },
      /*  {
        test: /\.(png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(jpg)$/,
        type: "asset/inline"
      }, */
      {
        test: /\.(bmp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        }
      },
      {
        test: /\.svg$/i,
        type: "asset/source"
      },
       {
        // 匹配文件的正则表达式，这里表示匹配JPG、PNG、GIF和SVG格式的图片文件
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
             // 使用image-webpack-loader对图片进行优化和压缩
            loader: 'image-webpack-loader',
            options: {
              // 是否禁用图片优化和压缩
              disable: process.env.NODE_ENV === 'development',
              mozjpeg: {
                progressive: true, // 是否开启渐进式JPEG，可以有效提升JPEG图片加载速度
                quality: 65 // 压缩JPEG图片的质量，取值范围为0到100，值越大质量越好但文件越大
              },
              optipng: {
                enabled: true // 是否开启PNG图片的优化，可以有效提升PNG图片加载速度
              },
              pngquant: {
                // 压缩PNG图片的质量范围，取值范围为0到1，值越大质量越好但文件越大
                // 第一个数字表示压缩质量的下限，第二个数字表示压缩质量的上限
                quality: [0.65, 0.9],
                speed: 4 // 压缩PNG图片的速度，取值范围为1到10，值越大速度越快但质量越低
              },
              svgo: {
                plugins: [ // 压缩SVG图片的插件列表，这里包含removeViewBox和cleanupIDs两个插件
                  { //用于删除SVG图片中的viewBox属性
                    //viewBox属性是用来指定SVG视口范围的，它的值是一个矩形框的坐标和宽高
                    removeViewBox: false
                  },
                  { //用于删除SVG图片中的无用ID属性
                    cleanupIDs: true
                  }
                ]
              },
              gifsicle: {
                interlaced: true // 是否开启GIF图片的隔行扫描,可以有效提升GIF图片加载速度
              }
            }
          }
        ]
      },
     {
       test: /\.(jpe?g|png)$/i,
       oneOf:[
           {
             resourceQuery: /sizes?/,
             use: [
               {
                 loader: 'responsive-loader',
                 options: {
                   adapter: require('responsive-loader/sharp'),
                 },
               },
             ]
           },
           {
             type:'asset/resource',
           }
       ]
     },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
    //new ESLintPlugin({ extensions: ['.js', '.ts'] })
+   new WebpackSpritesmith({
+   src:{//指定输入的文件
+       cwd:path.resolve(__dirname,'src/images/icons'),
+       glob:'**/*.png'
+   },
+   target:{//指定输出的文件路径
+       image:path.resolve(__dirname,'src/spritesmith-generated/sprite.png'),
+       css:path.resolve(__dirname,'src/spritesmith-generated/sprite.less'),
+   },
+   apiOptions:{
+       cssImageRef: "sprite.png"
+   },
+   spritesmithOptions: {
+       algorithm: 'top-down',
+       padding: 10
+     }
+   })
  ]
};
```

#### 9.4.2 src\index.js

src\index.js

```js
import "./icons.less"
```

#### 9.4.3 icons.less

src\icons.less

```less
@import "sprite.less";
.icon-twitter {
  .sprite(@twitter);
}
.icon-facebook {
  .sprite(@facebook);
}
.icon-github {
  .sprite(@github);
}
```

## 10.entry 配置

- 入口（Entry）指定了 Webpack 应该从哪里开始构建内部依赖图（dependency graph）来打包应用程序
- Webpack 支持四种形式的入口配置

### 10.1 字符串形式

- 指定单个入口文件路径

```js
module.exports = {
  entry: "./src/index.js",
}
```

### 10.2 函数形式

- 动态生成入口配置信息，函数中可返回字符串、对象或数组

```js
module.exports = {
  entry: {
    app: () => "./src/app.js",
  },
}
```

### 10.3 数组形式

- 指明多个入口文件，数组项可以为字符串、对象、函数形式，Webpack 会将数组指明的入口全部打包成一个 Bundle

```js
module.exports = {
  entry: ["./src/app.js", "./src/vendor.js"],
}
```

### 10.4 对象形式

#### 10.4.1 dependOn

- 指定多个入口文件路径，对象的属性名为 chunk 名称，值为入口文件路径。除了入口文件列表外，还可以指定入口依赖、Runtime 打包方式等
- `import`：声明入口文件，可以是路径字符串或路径数组（多入口）
- `dependOn`：声明该入口的前置依赖 Bundle，即在该入口代码执行前需要先执行的代码块

##### 10.4.1.1 webpack.config.js

webpack.config.js

```diff
module.exports = {
  mode: 'development',
  devtool: false,
  entry:{
+   vendor:"./src/vendor.js",
+   main: { import: "./src/index.js", dependOn: "vendor" }
  }
}
```

##### 10.4.1.2 src\index.js

src\index.js

```js
import { vendor } from "./vendor.js"
console.log(vendor)
```

##### 10.4.1.3 src\vendor.js

src\vendor.js

```js
export const vendor = "vendor"
```

#### 10.4.2 runtime

- `runtime`：设置该入口的 Runtime Chunk。若该属性不为空，Webpack 会将该入口的运行时代码抽离成单独的 Bundle
- 在 webpack 的 entry 中，可以设置`runtime`属性来指定该入口的`Runtime Chunk`
- Runtime Chunk 是 Webpack 打包过程中生成的一个额外的代码块，它包含了 Webpack 的运行时代码以及所有模块之间的链接逻辑
- 在 Webpack 4 之前，`Runtime Chunk`是默认被打包生成的，它会被注入到每一个输出文件中，但是 Webpack 4 之后可以通过 entry 中的 runtime 属性来控制是否生成`Runtime Chunk`
- 如果 entry 中的 runtime 属性不为空，则 Webpack 会将该入口的运行时代码抽离成一个单独的文件，并输出到指定的目录中。这样可以避免在每个输出文件中重复注入运行时代码，从而减小输出文件的体积

##### 10.4.2.1 webpack.config.js

webpack.config.js

```diff
module.exports = {
  mode: 'development',
  devtool: false,
  entry:{
+   vendor:{ import: "./src/vendor.js", runtime: "runtime-vendor" },
+   main: { import: "./src/index.js", runtime: "runtime-main" }
  }
}
```

### 10.5 output

- `output.publicPath`：指定产物发布的路径，通常用于处理静态资源的引用路径

- `output.clean`：指定打包前是否自动清理打包目录，以避免产生垃圾文件

- ```
  output.chunkLoading
  ```

  ：指定异步模块加载的技术方案，当打包出的产物中包含异步加载的模块时，Webpack 会根据 chunkLoading 属性的值来决定如何加载这些模块。可选的值有

  ```
  false
  ```

  、

  ```
  jsonp
  ```

  、

  ```
  require
  ```

  等

  - `false`：不使用异步加载，即将所有模块打包到一个文件中。这种方式的优点是简单易用，缺点是可能会导致打包文件过大，影响页面加载速度。
  - jsonp：使用 JSONP 技术实现异步加载。Webpack 会将异步模块打包成单独的文件，并通过 JSONP 方式在页面中动态加载。这种方式的优点是可以将异步模块分离出来，减少主包的大小，缺点是需要在服务端配置 JSONP 回调函数，可能存在跨域问题。
  - require：使用 require.ensure 实现异步加载。类似于 jsonp 方式，Webpack 会将异步模块打包成单独的文件，但是加载方式不同。这种方式的优点是与 CommonJS 规范兼容，可以在 Node.js 中使用，缺点是使用不太方便。

#### 10.5.1 webpack.config.js

webpack.config.js

```diff
module.exports = {
  mode: 'development',
  devtool: false,
  entry:"./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
+   publicPath:'/',
+   clean:true,
+   chunkLoading:'jsonp'
  }
}
```

#### 10.5.2 src\index.js

src\index.js

```js
import("./vendor").then((res) => console.log(res))
```

## 11. 服务器代理

如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。

### 11.1 不修改路径

- 请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。

```js
devServer: {
  proxy: {
    "/api": 'http://localhost:3000'
  }
}
```

### 11.2 修改路径

```js
devServer: {
  proxy: {
      "/api": {
       target: 'http://localhost:3000',
       pathRewrite:{"^/api":""}
      }
  }
}
```

### 11.3 onBeforeSetupMiddleware

- onBeforeSetupMiddleware 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

  ```js
  devServer: {
  onBeforeSetupMiddleware(devServer){// express()
      devServer.app.get('/api/users', (req, res) => {
        res.json([{ id: 1 }, { id: 2 }]);
      });
  }
  }
  ```

### 11.4 webpack-dev-middleware

[webpack-dev-middleware](https://www.npmjs.com/package/)就是在 Express 中提供 `webpack-dev-server` 静态服务能力的一个中间件

```js
npm install webpack-dev-middleware --save-dev
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');
webpackOptions.mode = 'development';
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
- 而使用`webpack-dev-middleware`的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等
