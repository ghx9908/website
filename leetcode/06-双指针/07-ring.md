---
title: 6. 环形链表 - 141
description: 双指针 链表
last_update:
  date: 02/02/2023
  author: zhongnan
---

## 题目

给你一个链表的头节点 `head` ，判断链表中`是否有环`。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则`链表中存在环`。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：`pos` 不作为参数进行传递 。仅仅是为了标识链表的实际情况.

如果链表中存在环 ，则返回 `true` 。 否则，返回 `false`.

示例 1:

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点
```

示例2：

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos=0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点
```

示例3：

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环
```

**提示：**

- 链表中节点的数目范围是 [0, 104]
- 105 <= Node.val <= 105
- pos 为 -1 或者链表中的一个 有效索引 。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/linked-list-cycle/

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 思路

  1.快慢指针初始化指向 head
  2.快指针走到末尾时停止
  3.慢指针走一步，快指针走两步
  4.快慢指针相遇，说明含有环

## 复杂度分析

- 时间复杂度：O(n)，其中 n 是链表的长度。
- 空间复杂度：O(1)。

## 答案

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    let show  = head
    let fast  =  head
    while(fast && fast.next){
        show  = show.next
        fast =  fast.next.next
        if(fast == show){
            return true
        }
    }
    return false
};
```
