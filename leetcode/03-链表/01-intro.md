---
title: 1. 链表理论知识
description: 二叉树理论基础
last_update:
  date: 02/03/2023
  author: 高红翔
---

# 定义

```js
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

class ListNode {
  val
  next = null
  constructor(value) {
    this.val = value
    this.next = null
  }
}
```

什么是链表，链表是一种通过指针串联在一起的线性结构，每一个节点由两部分组成，一个是数据域一个是指针域（存放指向下一个节点的指针），最后一个节点的指针域指向 null（空指针的意思）。

链表的入口节点称为链表的头结点也就是 head。

如图所示： ![链表1](https://img-blog.csdnimg.cn/20200806194529815.png)

# 链表的类型

- 单链表
- 双链表
- 循环链表

# 链表的存储方式

数组是在内存中是连续分布的，但是链表在内存中可**不是连续分布的**。

# 性能分析

再把链表的特性和数组的特性进行一个对比，如图所示：

![链表-链表与数据性能对比](https://img-blog.csdnimg.cn/20200806195200276.png)

数组在定义的时候，长度就是固定的，如果想改动数组的长度，就需要重新定义一个新的数组。

链表的长度可以是不固定的，并且可以动态增删， 适合数据量不固定，频繁增删，较少查询的场景。
