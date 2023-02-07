---
title: 9.  局部反转一个链表 -92
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/reverse-linked-list-ii/

## 解答

```js
const reverseBetween = function (head, m, n) {
  // 定义pre、cur，用leftHead来承接整个区间的前驱结点
  let pre, cur, leftHead
  // 别忘了用 dummy 嗷
  const dummy = new ListNode()
  // dummy后继结点是头结点
  dummy.next = head
  // p是一个游标，用于遍历，最初指向 dummy
  let p = dummy
  // p往前走 m-1 步，走到整个区间的前驱结点处
  for (let i = 0; i < m - 1; i++) {
    p = p.next
  }
  // 缓存这个前驱结点到 leftHead 里
  leftHead = p
  // start 是反转区间的第一个结点
  let start = leftHead.next
  // pre 指向start
  pre = start
  // cur 指向 start 的下一个结点
  cur = pre.next
  // 开始重复反转动作
  for (let i = m; i < n; i++) {
    let next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
  //  leftHead 的后继结点此时为反转后的区间的第一个结点
  leftHead.next = pre
  // 将区间内反转后的最后一个结点 next 指向 cur
  start.next = cur
  // dummy.next 永远指向链表头结点
  return dummy.next
}
```
