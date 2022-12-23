---
title: 删除排序链表中的重复元素 - 86
description: 双指针
last_update:
  date: 12/23/2022
  author: zhongnan
---

## 题目

给定一个已排序的链表的头 `head` ， 删除所有重复的元素，使每个元素只出现一次 。返回 `已排序的链表` 

示例 1:

```
输入：head = [1,1,2]
输出：[1,2]
```

```
输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

**提示：**

- 链表中节点数目在范围 [0, 300] 内
- -100 <= Node.val <= 100
- 题目数据保证链表已经按升序 排列

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 思路

由于给定的**链表是排好序的**，因此**重复的元素在链表中出现的位置是连续的**，因此我们只需要**对链表进行一次遍历**，就可以**删除重复的元素**。

具体地，我们从指针 `cur` 指向链表的头节点，随后开始对链表进行遍历。如果当前 `cur` 与 `cur.next` 对应的元素相同，那么我们就将 `cur.next` 从链表中移除；否则说明链表中已经不存在其它与 `cur` 对应的元素相同的节点，因此可以将 `cur` 指向 `cur.next`。

当遍历完整个链表之后，我们返回链表的头节点即可

## 复杂度分析

- 时间复杂度：O(n)，其中 n 是链表的长度。
- 空间复杂度：O(1)。

## 答案

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if(!head) return head
  let cur = head
  while(cur && !cur.next){
    if(cur.val ===cur.next.val){
      cur.next = cur.next.next
    }else{
      cur = cur.next
    }
  }
  return head
};

```
