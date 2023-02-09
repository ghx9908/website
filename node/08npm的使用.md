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

![](https://raw.githubusercontent.com/Gao-Hongxiang/image-hosting/master/img/20230209153037.png)

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
