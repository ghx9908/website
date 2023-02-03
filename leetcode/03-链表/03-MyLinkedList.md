---
title: 3. 设计链表 - 707
description: 链表
last_update:
  date: 02/03/2023
  author: 高红翔
---

## 题目

设计链表的实现。您可以选择使用单链表或双链表。单链表中的节点应该具有两个属性：`val` 和 `next`。`val` 是当前节点的值，`next` 是指向下一个节点的指针/引用。如果要使用双向链表，则还需要一个属性 `prev` 以指示链表中的上一个节点。假设链表中的所有节点都是 0-index 的。

在链表类中实现这些功能：

- get(index)：获取链表中第 `index` 个节点的值。如果索引无效，则返回`-1`。
- addAtHead(val)：在链表的第一个元素之前添加一个值为 `val` 的节点。插入后，新节点将成为链表的第一个节点。
- addAtTail(val)：将值为 `val` 的节点追加到链表的最后一个元素。
- addAtIndex(index,val)：在链表中的第 `index` 个节点之前添加值为 `val` 的节点。如果 `index` 等于链表的长度，则该节点将附加到链表的末尾。如果 `index` 大于链表长度，则不会插入节点。如果`index`小于 0，则在头部插入节点。
- deleteAtIndex(index)：如果索引 `index` 有效，则删除链表中的第 `index` 个节点。

**示例：**

```js
MyLinkedList linkedList = new MyLinkedList();
linkedList.addAtHead(1);
linkedList.addAtTail(3);
linkedList.addAtIndex(1,2);   //链表变为1-> 2-> 3
linkedList.get(1);            //返回2
linkedList.deleteAtIndex(1);  //现在链表是1-> 3
linkedList.get(1);            //返回3
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/design-linked-list/

## 解答

```js
class LinkNode {
  constructor(val, next) {
    this.val = val
    this.next = next
  }
}
/**
 * Initialize your data structure here.
 * 单链表 储存头尾节点 和 节点数量
 */
var MyLinkedList = function () {
  this._size = 0
  this._tail = null
  this._head = null
}
MyLinkedList.prototype.getNode = function (index) {
  // 创建虚拟头节点
  let cur = new LinkNode(0, this._head)
  // 0 -> head
  while (index >= 0) {
    cur = cur.next
    index--
  }
  return cur
}

/**
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function (index) {
  if (index < 0 || index >= this._size) return -1
  // 获取当前节点
  return this.getNode(index).val
}

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function (val) {
  const node = new LinkNode(val, this._head) //添加头节点
  this._size++ //修改总数
  if (this._head) {
    this._head = node //修改头指针
    return
  }
  //初始值为空的情况
  this._tail = node
  this._head = node
}

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function (val) {
  const node = new LinkNode(val, null) //初始化尾指针
  this._size++
  //本来存在尾指针的情况
  if (this._tail) {
    this._tail.next = node
    this._tail = node //修改尾指针
    return
  }
  //初始值为空的情况
  this._tail = node
  this._head = node
}

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
  if (index > this._size) return
  if (index <= 0) {
    this.addAtHead(val)
    return
  }
  if (index === this._size) {
    this.addAtTail(val)
    return
  }
  // 获取目标节点的上一个的节点
  const node = this.getNode(index - 1)
  node.next = new LinkNode(val, node.next)
  this._size++
}

/**
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
  if (index < 0 || index >= this._size) return
  if (index === 0) {
    this._head = this._head.next
    // 如果删除的这个节点同时是尾节点，要处理尾节点
    if (index === this._size - 1) {
      this._tail = this._head
    }
    this._size--
    return
  }
  // 获取目标节点的上一个的节点
  const node = this.getNode(index - 1)
  node.next = node.next.next
  // 处理尾节点
  if (index === this._size - 1) {
    this._tail = node
  }
  this._size--
}
```
