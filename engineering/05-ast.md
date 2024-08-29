---
title: 5. AST语法树
sidebar_position: 5
---

## 1.抽象语法树(Abstract Syntax Tree)

- 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示
- 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

## 2.抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
- 优化变更代码，改变代码结构使达到想要的结构

## 3.抽象语法树定义

- 这些工具的原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230301103909.png)

## 4.AST 遍历

- [astexplorer](https://astexplorer.net/)
- AST 是深度优先遍历

## 5.babel

- Babel 能够转译 `ECMAScript 2015+` 的代码，使它在旧的浏览器或者环境中也能够运行
- 工作过程分为三个部分
  - Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree 节点](https://github.com/estree/estree)
  - Transform(转换) 对抽象语法树进行转换
  - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

### 5.3 Visitor

- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- Visitor 的对象定义了用于 AST 中获取具体节点的方法
- Visitor 上挂载以节点 `type` 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法

#### 5.3.1 path

- [path](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/index.ts)
- node 当前 AST 节点
- parent 父 AST 节点
- parentPath 父 AST 节点的路径
- scope 作用域
- get(key) 获取某个属性的 path
- set(key, node) 设置某个属性
- is 类型(opts) 判断当前节点是否是某个类型
- find(callback) 从当前节点一直向上找到根节点(包括自己)
- findParent(callback)从当前节点一直向上找到根节点(不包括自己)
- insertBefore(nodes) 在之前插入节点
- insertAfter(nodes) 在之后插入节点
- replaceWith(replacement) 用某个节点替换当前节点
- replaceWithMultiple(nodes) 用多个节点替换当前节点
- replaceWithSourceString(replacement) 把源代码转成 AST 节点再替换当前节点
- remove() 删除当前节点
- traverse(visitor, state) 遍历当前节点的子节点,第 1 个参数是节点，第 2 个参数是用来传递数据的状态
- skip() 跳过当前节点子节点的遍历
- stop() 结束所有的遍历

#### 5.3.2 scope

- [scope](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts)
- scope.bindings 当前作用域内声明所有变量
- scope.path 生成作用域的节点对应的路径
- scope.references 所有的变量引用的路径
- getAllBindings() 获取从当前作用域一直到根作用域的集合
- getBinding(name) 从当前作用域到根使用域查找变量
- getOwnBinding(name) 在当前作用域查找变量
- parentHasBinding(name, noGlobals) 从当前父作用域到根使用域查找变量
- removeBinding(name) 删除变量
- hasBinding(name, noGlobals) 判断是否包含变量
- moveBindingTo(name, scope) 把当前作用域的变量移动到其它作用域中
- generateUid(name) 生成作用域中的唯一变量名,如果变量名被占用就在前面加下划线

### 5.1 实现日志插件

#### 5.1.1 logger.js

```js
const { transformSync } = require("@babel/core")
const types = require("@babel/types")
const path = require("path")
const sourceCode = `
console.log("hello");
`
const visitor = {
  CallExpression(nodePath, state) {
    const { node } = nodePath
    if (types.isMemberExpression(node.callee)) {
      if (node.callee.object.name === "console") {
        if (["log", "warn", "info", "error", "debug"].includes(node.callee.property.name)) {
          const { line, column } = node.loc.start
          // 获取相对于当前文件的文件名并将反斜杠替换为正斜杠
          const relativeFileName = path.relative(__dirname, state.file.opts.filename).replace(/\\/g, "/")
          // 将文件名和位置信息插入到参数列表的开头
          node.arguments.unshift(types.stringLiteral(`${relativeFileName} ${line}:${column}`))
        }
      }
    }
  },
}

function logParamPlugin() {
  return {
    visitor,
  }
}
const { code } = transformSync(sourceCode, {
  filename: "any.js",
  plugins: [logParamPlugin()],
})
console.log(code)
```

### 5.7 自动日志插件

- [babel-helper-plugin-utils](https://babeljs.io/docs/en/babel-helper-plugin-utils)
- [babel-types](https://babeljs.io/docs/en/babel-types.html#api)用来生成节点和判断节点类型
- [babel-helper-module-imports](https://babeljs.io/docs/en/babel-helper-module-imports)帮助插入模块
- [@babel/template](https://www.npmjs.com/package/@babel/template)根据字符串模板生成 AST 节点
- `state` 用于在遍历过程中在 AST 节点之间传递数据的方式

#### 5.2.1 use.js

```js
const { transformSync } = require("@babel/core")
const types = require("@babel/types")
const path = require("path")
const autoLoggerPlugin = require("./autoLoggerPlugin")
const sourceCode = `
let _logger2 = 'xxx';
function sum(a,b){
    return a+b;
}
const multiply = function(a,b){
    return a*b;
}
const minis = (a,b)=>a-b;
class Math{
    divide(a,b){
        return a/b;
    }
}
`
const { code } = transformSync(sourceCode, {
  filename: "some.js",
  plugins: [
    autoLoggerPlugin({
      fnNames: ["sum"],
      libName: "logger", //把获取业务数据的逻辑写在logger里
      params: ["a", "b", "c"],
    }),
  ],
})
console.log(code)
```

#### 5.2.2 autoLoggerPlugin.js

```js
const types = require("@babel/types")
const pathLib = require("path")
const importModuleHelper = require("@babel/helper-module-imports")
const template = require("@babel/template")

function autoLoggerPlugin(options) {
  return {
    visitor: {
      Program: {
        //state 可以在遍历过程保存和传递状态
        enter(path, state) {
          let loggerId
          path.traverse({
            ImportDeclaration(path) {
              debugger
              //获取导入库的名称
              //const libName = path.node.source.value;
              //jquery.find 在path的下层属性中寻找属性名为source的路径path,
              const libName = path.get("source").node.value
              //如果此导入语句导入的第三方模块和配置的日志第三方库名称一样
              if (options.libName === libName) {
                const specifierPath = path.get("specifiers.0")
                if (
                  specifierPath.isImportDefaultSpecifier() ||
                  specifierPath.isImportSpecifier() ||
                  specifierPath.isImportNamespaceSpecifier()
                ) {
                  loggerId = specifierPath.node.local
                }
                path.stop() //停止遍历查找
              }
            },
          })
          //如果遍历完Program，loggerId还是空的，那说明在源码中尚未导入logger模块
          if (!loggerId) {
            loggerId = importModuleHelper.addDefault(path, options.libName, {
              //在Program作用域内生成一个不会与当前作用域内变量重复的变量名
              nameHint: path.scope.generateUid(options.libName),
            })
          }
          //使用template模块生成一个ast语法树节点,把一个字符串变成节点
          state.loggerNode = template.statement(`LOGGER_PLACE();`)({
            LOGGER_PLACE: loggerId.name,
          })
          //state.loggerNode = types.expressionStatement(types.callExpression(loggerId,[]));
        },
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(path, state) {
        const { node } = path
        let fnName
        if (node.type === "FunctionDeclaration") {
          fnName = node.id.name
        }
        if (options.fnNames.includes(fnName)) {
          if (types.isBlockStatement(node.body)) {
            node.body.body.unshift(state.loggerNode)
          } else {
            const newNode = types.blockStatement([state.loggerNode, types.returnStatement(node.body)])
            path.get("body").replaceWith(newNode)
          }
        }
      },
    },
  }
}
module.exports = autoLoggerPlugin
```

### 5.3 eslint

- [rules](http://https//eslint.bootcss.com/docs/rules/)

#### 5.3.1 use.js

```js
const { transformSync } = require("@babel/core")
const types = require("@babel/types")
const path = require("path")
const noConsolePlugin = require("./noConsolePlugin")
const sourceCode = `
var a = 1;
console.log(a);
var b = 2;
`
const { code } = transformSync(sourceCode, {
  filename: "./some.js",
  plugins: [
    noConsolePlugin({
      fix: true,
    }),
  ],
})
console.log(code)
```

#### 5.3.2 eslintPlugin.js

eslintPlugin.js

```js
function noConsolePlugin(options) {
  return {
    pre(file) {
      file.set("errors", [])
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path
        const errors = state.file.get("errors")
        if (node.callee.object && node.callee.object.name === "console") {
          const stackTraceLimit = Error.stackTraceLimit
          Error.stackTraceLimit = 0
          errors.push(path.buildCodeFrameError(`代码中不能出现console语句`, Error))
          Error.stackTraceLimit = stackTraceLimit
          if (options.fix) {
            //如果需要自动修复，就删除此语句
            path.parentPath.remove()
          }
        }
      },
    },
    post(file) {
      console.log(...file.get("errors"))
    },
  }
}
module.exports = noConsolePlugin
```

## 6. webpack 中使用 babel 插件

#### 6.1.1 webpack 配置

```js
npm i webpack webpack-cli babel-plugin-import -D
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        {
            loader:'babel-loader',
            options:{
                "plugins": [[
                    path.resolve('./plugins/babel-plugin-import.js')
                    , {
                    "libraryDirectory": "",
                    "libraryName": "lodash"
                  }]]
            }
        },
      },
    ],
  },
};
```

> 编译顺序为首先`plugins`从左往右,然后`presets`从右往左

#### 6.1.2 babel 插件

plugins\babel-plugin-import.js

```js
const types = require("@babel/types")
const template = require("@babel/template")
function babelPluginImport() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path
        const { specifiers } = node
        const { libraryName, libraryDirectory = "lib" } = state.opts
        if (node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])) {
          const newImportDeclarations = specifiers.map((specifier) => {
            return template.statement(
              `import ${specifier.local.name} from '${libraryName}/${specifier.imported.name}';`
            )()
            /* return types.importDeclaration(
                        [types.importDefaultSpecifier(specifier.local)],
                        types.stringLiteral(libraryDirectory?
                            `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
                            :`${libraryName}/${specifier.imported.name}`)
                    ); */
          })
          path.replaceWithMultiple(newImportDeclarations)
        }
      },
    },
  }
}
module.exports = babelPluginImport
```

## 7. 参考

- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types)
- [不同的 parser 解析 js 代码后得到的 AST](https://astexplorer.net/)
- [在线可视化的看到 AST](http://resources.jointjs.com/demos/javascript-ast)
- [babel 从入门到入门的知识归纳](https://zhuanlan.zhihu.com/p/28143410)
- [Babel 内部原理分析](https://octman.com/blog/2016-08-27-babel-notes/)
- [babel-plugin-react-scope-binding](https://github.com/chikara-chan/babel-plugin-react-scope-binding)
- [transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译,启用插件 `babel-plugin-transform-runtime` 后，Babel 就会使用 babel-runtime 下的工具函数
- [ast-spec](https://github.com/babel/babylon/blob/master/ast/spec.md)
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
