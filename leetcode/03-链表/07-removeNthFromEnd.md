---
title: 7.  删除链表的倒数第 N 个结点 -19
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/

## 解答

```js
const removeNthFromEnd = function (head, n) {
  // 初始化 dummy 结点

  const dummy = new ListNode()
  // dummy指向头结点
  dummy.next = head
  // 初始化快慢指针，均指向dummy
  let fast = dummy
  let slow = dummy

  // 快指针闷头走 n 步
  while (n !== 0) {
    fast = fast.next
    n--
  }

  // 快慢指针一起走
  while (fast.next) {
    fast = fast.next
    slow = slow.next
  }

  // 慢指针删除自己的后继结点
  slow.next = slow.next.next
  // 返回头结点
  return dummy.next
}
```
