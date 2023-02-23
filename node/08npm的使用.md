---
title: 8. npm 的使⽤
last_update:
  date: 02/09/2023
  author: 高红翔
---

## **1.npm init**

默认⼤家肯定⽐较熟悉了，直接 npm init -y 了事，这回我们再来仔细看看

```json
{
  "name": "my-pack",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {},
  "license": "ISC"
}
```

- name 是当前包的名字，也就是最终发布的 npm 官⽹上包的名字。不能和已有的包重名

- version 就是当前包的版本号，主要我们要探究如果优雅的管理版本号

  大版本（vu2->vue3） 中版本(API 的增加) 小版本（bug 的修复）

- main 就是当前包的⼊⼝⽂件，也就是使⽤**require**默认引⼊的⽂件

- description 描述信息

- scripts 可以配置⼀些执⾏脚本

- license 协议许可

## 2. licens

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230209153037.png)

## 3.安装 install

### **1).**全局安装

全局模块

- 全局模块 vite vue-cli cra 工具类的都是全局的。 最终只能在命令行中使用

```bash
npm install http-server -g
```

查看配置

```bash
npm config list
```

全局安装的意思很简单，就是安装的模块会被安装到全局下，可以在命令⾏中直接使⽤安装的包。包会安装到`/usr/local/lib`⽬录下，可以通过`npm config list` 来进⾏查看。并且会在`/usr/local/bin`⽬录下创造软链

> `/usr/local/bin` 是 mac 的系统⽬录，默认会被配置到环境变量中，此⽬录下的⽂件可以直接被访问。（通过`echo $PATH`打印所有环境变量）

> windows : `C:\Users\xxx\AppData\Roaming\npm `

- `/usr/local/bin` 这个目录可以执行的原因是因为 是系统目录 （环境变量中存在它，所有可以直接访问）

我们可以⾃⼰来尝试写⼀个全局包 ，创建 bin ⽬录并新增 www ⽂件。

bin/www

```js
#! /usr/bin/env node
console.log("my pack") // #! 这句表示采⽤node来执⾏此⽂件，同理 shell可以表示 sh
```

package.json

```js
{
  "name": "my-pack",
  "version": "1.0.0",
  "description": "",
  "main": "b.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "bin": {
    "my-pack": "./bin/www"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ghx9908/node.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ghx9908/node/issues"
  },
  "homepage": "https://github.com/ghx9908/node#readme"
}

```

```bash
npm link  # npm  link 链接到全局下, 如果更改运行方式 需要重新link . link用于测试本地项目的
```

这样我们在命令⾏中直接输⼊ my-pack 就可以打印出，`my pack`

正规写完包之后，我们需要发布到 npm 上，之后通过 npm install -g 的方式安装到电脑中 都只能用在命令行中

### **2).**本地安装

```js
npm install gulp --save-dev //npm install 包名@版本号 --save-dev (webpack、gulp) / --save （vue react）
```

> 本地安装就是在项⽬中使⽤，⽽⾮在命令⾏中使⽤！这⾥我们看到⽣成了⼀个**package-lock.json\*\***⽂件**，⽽且将安装的模块放到了**node_modules\*\*下，⽽且 json 中也新增了些内容

```json
"devDependencies": {
	"gulp": "^4.0.2"
}
```

> --save-dev 代表当前依赖只在开发时被应⽤,如果默认不写相当于 --save 为项⽬依赖开发上线都需要。

**也可以指定版本号来安装包**

```bash
npm i jquery@2.2.0 # install可以简写成
```

默认执⾏ npm i 会安装项⽬中所需要的依赖,如果只想安装⽣产环境依赖可以增加--production 参数

### **3).package-lock.json**⽂件

> package-lock.json ⽂件⽤于锁定安装的 npm 包的版本，并且记录了它们的所有依赖关系。它保证了在不同的开发环境中使⽤ npm 安装时，所安装的包版本是相同的。**需要上传 git**

```json
"node_modules/array-unique": {
"version": "0.3.2",
"resolved":
"https://registry.npmmirror.com/array-unique/-
/array-unique-0.3.2.tgz",
"integrity": "sha512-
SleRWjh9JUud2wH1hPs9rZBZ33H6T9HOiL0uwGnGx9FpE6wK
GyfWugmbkEOIs6qWrZhg0LWeLziLrEwQJhs5mQ==",
"dev": true,
"engines": {
"node": ">=0.10.0"
 },
....
}
```

> 如果⼿动更新了 package.json ⽂件,执⾏安装命令会下载对应的新版本,并且会⾃动更新 lock ⽂件~

### **4).**依赖⽅式

- dependencies 项⽬依赖

可以使⽤ npm install -S 或 npm install --save 保存到依赖中，当发布到 npm 上时 dependencies 下的模块会作为依赖⼀起被下载!

- devDependencies 开发依赖

可以使⽤ npm install -D 或 npm install --save-dev 保存到依赖中。 如果只是单纯的开发项⽬ dependencies、devDependencies 只有提示的作⽤。

- peerDependencies 同版本依赖

同等依赖，如果你安装我，那么你最好也安装我对应的依赖 (windows 下不会自动安装)

- optionalDependencies 可选依赖

如果发现⽆法安装或⽆法找到，不会影响 npm 的安装

- bundledDependencies 捆绑依赖

使⽤ npm pack 打包 tgz 时会将捆绑依赖⼀同打包

## **4.npm**版本管理

npm 采⽤了 semver 规范作为依赖版本管理⽅案。semver 约定⼀个包的版本号必须包含 3 个数字

`MAJOR.MINOR.PATCH`意思是 主版本号.⼩版本号.修订版本号

- MAJOR 对应⼤的版本号迭代，做了不兼容旧版的修改时要更新 MAJOR 版本号

- MINOR 对应⼩版本迭代，发⽣兼容旧版 API 的修改或功能更新时，更新 MINOR 版本号

- PATCH 对应修订版本号，⼀般针对修复 BUG 的版本号

当我们每次发布包的时候都需要升级版本号

```bash
npm version major # ⼤版本号加 1，其余版本号归 0
npm version minor # ⼩版本号加 1，修订号归 0
npm version patch # 修订号加 1
```

预发版：

- alpha(α)：预览版，或者叫内部测试版；⼀般不向外部发布，会有很多 bug；⼀般只有测试⼈员使⽤。 "1.0.0-alpha.1"

- beta(β)：测试版，或者叫公开测试版；这个阶段的版本会⼀直加⼊新的功能；在 alpha 版之后推出。 "1.0.0-beta.1"

- rc(release candidate)：最终测试版本；可能成为最终产品的候选版本，如果未出现问题则可发布成为正式版本。"1.0.0-rc.1"

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230209181600.png)

## **5.scripts**配置

在`package.json`中可以定义⾃⼰的脚本通过`npm run`来执⾏

```json
"scripts": {
"hello": "echo hello"
}
```

- `npm run` 命令执⾏时，会把 `./node_modules/.bin/` ⽬录添加到执⾏环境的 PATH 变量中，因此如果某个**命令⾏包**未全局安装，⽽只安装在了当前项⽬的 node_modules 中，通过` npm run` ⼀样可以调⽤该命令。

  eg: webpack 为了保证项目中用的版本都是一样的，我们会将 webpack 安装到项目中

- 执⾏ npm 脚本时要传⼊参数，需要在命令后加 -- 标明, 如`npm run start-- --port 3000` 可以将 --port 参数传给 start 命令

```json
"scripts": {
    "start": "http-server"
  }
```

- npm 提供了 pre 和 post 两种钩⼦机制，可以定义某个脚本前后的执⾏脚本,没有定义默认会忽略

  ```json
  "scripts": {
  "prehello":"echo prehello",
  "hello": "echo hello",
  "posthello":"echo posthello"
  }
  ```

## **6.npx**⽤法

### **1).**执⾏脚本

npx 命令是 npm v5.2 之后引⼊的新命令，npx 可以帮我们直接执⾏`node_modules/.bin`⽂件夹下的⽂件

```bash
npx mime
```

### **2).**避免安装全局模块

```bash
npx create-react-app react-project
```

- 我们可以直接使⽤ npx 来执⾏模块，它会先进⾏安装，安装执⾏后会将下载过的模块删除，这样可以⼀直使⽤最新版本

- 保证最新的， 可以运行已经存在的文件
- 如果使用 npx 包存在则直接使用
- npx 不能像 run 一样记录一些代码 (npx 测试方法)

## **7.**包的发布

包的发布⽐较简单，⾸先我们需要先切换到官⽅源,这⾥推荐个好⽤的⼯具 nrm

```bash
npm install nrm -g
nrm use npm # 切换到官⽅源
```

```bash
nrm ls # 查看源    nrm hrlp
  #npm ---------- https://registry.npmjs.org/
  #yarn --------- https://registry.yarnpkg.com/
  #tencent ------ https://mirrors.cloud.tencent.com/npm/
  #cnpm --------- https://r.cnpmjs.org/
  #taobao ------- https://registry.npmmirror.com/
  #npmMirror ---- https://skimdb.npmjs.com/registry/
```

- `nrm use` 切换到官方源
- ` npm login` 登录输入邮箱 密码 用户名
- ` npm publish` 发布

**登录**

https://www.npmjs.com/

```bash
npm login
```

```bash
npm who am i
```

更新包名字，忽略⽂件夹可以使⽤ .npmignore，⼀切就绪后，发布！！！

```bash
npm publish
npm publish -h
npm publish --access public
npm unpublish [<package-spec>]
```

**注册**

```bash
npm addUser
```
