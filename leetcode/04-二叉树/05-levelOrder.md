---
title: 二叉树的层序遍历
description: 广度优先遍历 队列思想
last_update:
  date: 12/26/2022
  author: 高红翔
---

给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]
```

**示例 2：**

```
输入：root = [1]
输出：[[1]]
```

**示例 3：**

```
输入：root = []
输出：[]
```

**提示：**

- 树中节点数目在范围 `[0, 2000]` 内
- `-1000 <= Node.val <= 1000`

  来源：力扣（LeetCode）
  链接：https://leetcode.cn/problems/binary-tree-level-order-traversal/description/

## 解题

### 返回二维数组

```js
var levelOrder = function (root) {
  /* 非递归的实现方式 */
  let res = []
  if (root == null) return res
  let queue = [root] //根节点入队
  // while 循环控制从上向下一层层遍历
  while (queue.length) {
    let size = queue.length //本次遍历的数量
    // 记录这一层的节点值
    let level = []
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < size; i++) {
      let cur = queue.shift()
      level.push(cur.val)
      //左右节点入队
      if (cur.left != null) queue.push(cur.left)
      if (cur.right != null) queue.push(cur.right)
    }
    res.push(level)
  }
  return res
}
```

### 返回一维数组

```js
function BFS(root) {
  const res = []
  if (!root) return res
  const queue = [] // 初始化队列queue
  // 根结点首先入队
  queue.push(root)
  // 队列不为空，说明没有遍历完全
  while (queue.length) {
    const top = queue.shift() // 取出队头元素
    res.push(top.val)
    // 左右节点入队
    if (top.left) queue.push(top.left)
    if (top.right) queue.push(top.right)
  }
}
```
