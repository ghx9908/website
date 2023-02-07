---
title: 12.相交链表 -160
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/intersection-of-two-linked-lists/

## 解答

### 哈希表

```js
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null
  const hashmap = new Map()

  let pA = headA
  while (pA) {
    hashmap.set(pA, 1)
    pA = pA.next
  }

  let pB = headB
  while (pB) {
    if (hashmap.has(pB)) return pB
    pB = pB.next
  }
  return null
}
```

### 双指针

```js
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null

  let pA = headA,
    pB = headB
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next
    pB = pB === null ? headA : pB.next
  }
  return pA
}
```
