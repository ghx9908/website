---
title: 10.  环形链表 -141
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你一个链表的头节点 head ，判断链表中是否有环。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/linked-list-cycle/

## 解答

```js
const hasCycle = function (head) {
  // 只要结点存在，那么就继续遍历
  while (head) {
    // 如果 flag 已经立过了，那么说明环存在
    if (head.flag) {
      return true
    } else {
      // 如果 flag 没立过，就立一个 flag 再往 下走
      head.flag = true
      head = head.next
    }
  }
  return false
}
```
