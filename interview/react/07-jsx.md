---
title: 7. jsx语法转换生成虚拟DOM
last_update:
  date: 02/07/2023
  author: zhongnan
---

## jsx语法转换生成虚拟DOM?

### 前言
>**`react`中的`jsx`语法很多伙伴都会使用
>- 但是你知道它的本质是什么吗？运行中它会做如何的转换呢？
>- `jsx`内部又是怎么生成了虚拟`DOM`？
>- 虚拟`DOM`又是如何挂载到真实`DOM`上去的呢？

带着这些问题，我们做个讲解把，相信深度了解本文后，肯定会jsx、虚拟`DOM`有进一步的理解

### 1. react中的jsx语法
>简单的`jsx`语法, 就是再`js`中写`html`元素，前提是`script`标签必须加 `type=text/babel`, 否则jsx语法会报错
![img](https://img-blog.csdnimg.cn/669b83911e0d4820b2e1a4e9118c900f.png)

- jsx 仅仅只是 React.createElement(component, props, ...children) 函数的语法糖

```const msg1 = <h2>哈哈哈</h2>```

- 在js中上面这段代码等价于下面这段react.createElement()的值

```const msg2 = React.createElement("h2", null, "哈哈哈");//js语法```

### 2. jsx语法在babel中会转成 React.createElement()的函数调用。
>注意：使用了React相关的方法一定先引入react.development.js 和react-dom.development.js这两个文件，否则会报错


```<script src="../react/react.development.js"></script>```
```<script src="../react/react-dom.development.js"></script>```


### 3. babel转换
我们先用`jsx`语法, 开发页面。部分`html`代码省略，只写核心`js`代码

```<script src="../react/react.development.js"></script>```
```<script src="../react/react-dom.development.js"></script>```
```//babel.min文件 是将 jsx转成 React.createElement函数调用的```
```<script src="../react/babel.min.js"></script>```
```<script type='text/babel'>```
```// 这是jsx语法```
```const msg1 = ```
 ```  <div class="header">```
    ``` <h2>头部</h2>```
    ``` <div class="main">主题</div>```
    ``` <footer>这里是尾部</footer>```
  ``` </div>;```
```ReactDOM.render(msg1, document.getElementById("app"));```
```</script>```
用浏览器打开文件，查看页面效果
![img](https://img-blog.csdnimg.cn/fa66de7dd07f49a090517b6e7d837a14.png)


然后我们在把上面的`jsx`代码转成 `React.createElement`函数的形式

可以在`babel`的官网中快速查看转换的过程。`babel`官网链接：https://babeljs.io/repl/#?presets=react
![img](https://img-blog.csdnimg.cn/dc6e80a359694b9ca108513dd2d098be.png)


复制右边转换后的`React.createElement`函数调用代码到`js`中

```<script src="../react/react.development.js"></script>```
```<script src="../react/react-dom.development.js"></script>```
```// type="text/babel" 可以去掉,babel.min.js 也可以不用了。```
```// 因为我们代码中没有了jsx语法了。下面的代码属于正常的js代码```
```<script>```
```const msg2 = React.createElement("div", {```
   	```class: "header"```
```}, React.createElement("h2", null, "\u5934\u90E8"), React.createElement("div", {```
    ```class: "main"```
```}, "\u4E3B\u9898"), React.createElement("footer", null, "\u8FD9\u91CC\u662F\u5C3E\u90E8"));```
```//React.reder 函数渲染到浏览器上```
```ReactDOM.render(msg2, document.getElementById("app"));```
```</script>```

在浏览器中打开后，查看页面
![img](https://img-blog.csdnimg.cn/bc2c4c4a883d40dc8bea31bc97fdfa1f.png)

`jsx`语法和`React.createElement`函数的方法都可以得到相同的结果，渲染在页面的正是`DOM`也是一样的。

>所以我们可以得出结论：`jsx` 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖

在真实开发中我们不会使用`React.createElement`函数的方式写代码，因为可读性太差了，代码量又多，难维护，我们更喜欢使用`jsx`语法来编写代码

`React.render`函数是怎样把createElement函数的返回值挂载到DOM上的呢？

### 4. 虚拟DOM的创建过程
```React.createElement``` 最终创建出来一个 ```ReactElement```对象

在上面的```React.createElement```函数调用后，打印它的返回值

```const msg2 = React.createElement("div", {```
  ```  class: "header"```
``` },React.createElement("h2", null, "\u5934\u90E8"), React.createElement("div", {```
    ```class: "main"```
 ```}, "\u4E3B\u9898"), React.createElement("footer", null, "\u8FD9\u91CC\u662F\u5C3E\u90E8"));```

```console.log(msg2);```
```ReactDOM.render(msg2, document.getElementById("app"));```

在浏览器打开，查看结果

![img](https://img-blog.csdnimg.cn/4529a861293b432b9fbd748d581547fb.png)

- ```msg2```就是一个```object```对象，对象的第一层是```html```中的最外层```class```等于```header```的```div```。```div```里面的三个子元素，放在对象中的```props```对象中的```children```数组中一一对应。如果```h2```标签中还有子元素，那```h2```对象中的```props```对象中的```children```数组又会有```objectd```对象，… 这将一层一层的往下套

- ```React```利用```ReactElement```对象组成了一个```JavaScript```的对象树

- ``msg2``就是调用```React.createElement```函数时候，通过```ReactElement```函数转成一个```JavaScript```对象树的

- 在```react```源码下```/packages/react/index.js```文件找到了```createElement```函数，它是 ```./src/React```文件下导出的
![img](https://img-blog.csdnimg.cn/a2b9a9dab04a4a67a87115ec28e36c0e.png)

- 找到```react```文件，发现它是 ```./ReactElement```文件下导出的
![img](https://img-blog.csdnimg.cn/ec4d2408e5274f23aaac2e817e60a1c6.png)


- 找到```ReactElement```文件，里面有一个```createElement```函数，在```js```中本质上就是在调用这个函数
![img](https://img-blog.csdnimg.cn/043e214470514358bc957cb544fb317f.png)
![img](https://img-blog.csdnimg.cn/a3a5a254e0304ce3b122b4ceb0a26c6e.png)


- 它又调用了另一个```ReactElement```函数
![img](https://img-blog.csdnimg.cn/95eaaac92b8741a5bb33c193670eb436.png)
![img](https://img-blog.csdnimg.cn/9d300f9b3577456499529d3b9e3eacf7.png)



- 这个```ReactElement```函数返回是一个```object```对象，这个对象就是我们在浏览器打印出来的那个```msg2```, 它就是```javascript```对象树

>JavaScript的对象树就是大名鼎鼎的虚拟DOM

- 有了虚拟DOM，那怎么把虚拟DOM映射到真实的DOM上呢？

- react是通过ReactDOM.render 函数把虚拟DOM挂载到真实DOM的

```//把虚拟DOM挂载到 id为app的元素中```
```ReactDOM.render(msg2, document.getElementById("app"));```


### 5.为什么要使用虚拟DOM
- 很难跟踪状态发生的改变：原有的开发模式，我们很难跟踪到状态发生的改变，不方便针对我们应用程序进行调试
- 操作真实```DOM```性能较低：传统的开发模式会进行频繁的```DOM```操作，而这一的做法性能非常的低
