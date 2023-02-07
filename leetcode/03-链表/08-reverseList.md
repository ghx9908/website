---
title: 8.  反转链表 -206
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/reverse-linked-list/description/

## 解答

```js
const reverseList = function (head) {
  // 初始化前驱结点为 null
  let pre = null
  // 初始化目标结点为头结点
  let cur = head
  // 只要目标结点不为 null，遍历就得继续
  while (cur !== null) {
    // 记录一下 next 结点
    let next = cur.next
    // 反转指针
    cur.next = pre
    // pre 往前走一步
    pre = cur
    // cur往前走一步
    cur = next
  }
  // 反转结束后，pre 就会变成新链表的头结点
  return pre
}
```
