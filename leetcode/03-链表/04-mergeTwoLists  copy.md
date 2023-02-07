---
title: 4. 合并两个有序链表 -21
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

链接：https://leetcode.cn/problems/merge-two-sorted-lists/

## 解答

### 双指针

```js
const mergeTwoLists = function (l1, l2) {
  // 定义头结点，确保链表可以被访问到
  let head = new ListNode()
  // cur 这里就是咱们那根“针”
  let cur = head
  // “针”开始在 l1 和 l2 间穿梭了
  while (l1 && l2) {
    // 如果 l1 的结点值较小
    if (l1.val <= l2.val) {
      // 先串起 l1 的结点
      cur.next = l1
      // l1 指针向前一步
      l1 = l1.next
    } else {
      // l2 较小时，串起 l2 结点
      cur.next = l2
      // l2 向前一步
      l2 = l2.next
    }

    // “针”在串起一个结点后，也会往前一步
    cur = cur.next
  }

  // 处理链表不等长的情况
  cur.next = l1 !== null ? l1 : l2
  // 返回起始结点
  return head.next
}
```

### 递归

```js
var mergeTwoLists = function (list1, list2) {
  if (!list1) return list2
  if (!list2) return list1
  if (list1.val > list2.val) {
    list2.next = mergeTwoLists(list1, list2.next)
    return list2
  } else {
    list1.next = mergeTwoLists(list1.next, list2)
    return list1
  }
}
```
