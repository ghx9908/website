---
title: 1. 谈谈你对 BFC 的理解，如何创建 BFC?
last_update:
  date: 01/03/2022
  author: 高红翔
---

### 概念：

- **Box:**Box 是 CSS 布局的对象和基本单位，一个页面是由很多个 Box 组成的，这个 Box 就是我们常说的盒模型
- **Block Formatting Cotext:**块级上下文格式化，它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位以及和其他元素的关系和相互作用

块级格式化上下文(Block Formatting Cotext，BFC)是 Web 页面的可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

通俗来讲：BFC 是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并不会影响其他环境中的物品。如果一个元素符合触发 BFC 的条件，则 BFC 中的元素布局不受外部影响

### 创建 BFC 的条件

- 根元素：Body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position（absolute、fixed）；
- display 值为：inline-block、table-cell、table-caption、flex 等
- overflow 值为：hidden、auto、scroll

### BFC 的特点：

- 垂直方向，自上而下排列，和文档流的排列方式一直
- 在 BFC 中上下相邻的两个容器的 margin 会重叠
- 计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素
- 每个元素的左 margin 值和容器的左 border 相接触

### BFC 的作用

- `解决margin的重叠问题：`由于 BFC 是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个 BFC，就解决了 margin 重叠的问题。
- `解决高度塌陷的问题：`在对子元素设置浮动之后，父元素会发生高度塌陷，也就是父元素的高度为 0，解决这个问题，只需要把父元素变成一个 BFC。常用的办法是给父元素设置`overflow：hidden`。
- `创建自适应两栏布局：`可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应。

```
.left {
  width: 100px;
  height: 200px;
  background: red;
  float: left;
}
.right{
    height:300px;
    background:blue;
    overflow:hidden;
}

<div class="left"></div>
<div class="right"></div>
/* 左侧设置float：left，右侧设置overflow：hidden。这样右边就触发BFC，BFC的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠，实现自适应两栏布局 */
```

- ` 解决外边距塌陷问题` ：两个嵌套关系的（父子关系）块元素，当父元素有上外边距或者没有上外边距（margin-top），子元素也有上外边距的时候。两个上外边距会合成一个上外边距，以值相对较大的上外边距值为准。

- **解决方法**

  1. 给父元素设置外边框（border）或者内边距（padding）(不建议) ----影响结构

  2. 触发 BFC（推荐）

  - 子元素或者父元素的**float**不为**none**
  - 子元素或者父元素的**position**不为**relative**或**static**
  - 父元素的**overflow**为**auto**或**scroll**或**hidden**
  - 父元素的**display**的值为**table-cell**或**inline-block**
