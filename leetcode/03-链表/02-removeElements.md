---
title: 2. 移除链表元素 - 203
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/03/06/removelinked-list.jpg)

```
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

**示例 2：**

```
输入：head = [], val = 1
输出：[]
```

**示例 3：**

```
输入：head = [7,7,7,7], val = 7
输出：[]
```

**提示：**

- 列表中的节点数目在范围 `[0, 104]` 内
- `1 <= Node.val <= 50`
- `0 <= val <= 50`

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/remove-linked-list-elements/description/

## 解答

```js
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
  const ret = new ListNode(0, head) // 虚拟头节点
  let cur = ret // 移动的指针
  //循环
  while (cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next
      continue
    }
    cur = cur.next
  }
  return ret.next //返回头节点
}
```
