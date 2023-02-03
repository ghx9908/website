---
title: 8. 环形链表 II - 142
description: 双指针 链表
last_update:
  date: 02/03/2023
  author: zhongnan
---

## 题目

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 `pos 是 -1，则在该链表中没有环`。

## 注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况,不允许修改链表


示例 1:

![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点
```

示例2：

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos=0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点
```

示例3：

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环
```

**提示：**

- 链表中节点的数目范围是 [0, 104]
- 105 <= Node.val <= 105
- pos 为 -1 或者链表中的一个 有效索引 。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/linked-list-cycle-ii/description/

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 思路

  1. 都从头节点出发
  2. head就是null了，没有入环点，直接返回null
  3. fastP.next为null也说明无环
  4. 慢指针走一步
  5. 快指针走两步
  6. 首次相遇
  7. 让快指针回到头节点
  8. 开启循环，让快慢指针相遇
  9. 相遇，地点发生在入环处
  10. 返回出指针的位置
  11. 快慢指针都走一步

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
 * @return {ListNode}
 */
var detectCycle = function(head) {
    let slow = head
    let fast = head
    while(fast && fast.next){
        slow = slow.next
        fast = fast.next.next
        if(fast==slow){
            fast = head
            while(true){
                if(fast==slow ){
                    return slow
                }
                fast = fast.next
                slow = slow.next
            }
        }
    }
    return null
};
```
