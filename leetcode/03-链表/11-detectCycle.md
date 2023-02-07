---
title: 11.   定位环的起点 -141
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给定一个链表的头节点 head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/linked-list-cycle-ii/

## 解答

```js
const detectCycle = function (head) {
  while (head) {
    if (head.flag) {
      return head
    } else {
      head.flag = true
      head = head.next
    }
  }
  return null
}
```
