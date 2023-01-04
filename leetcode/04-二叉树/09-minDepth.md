---
title: 9. 二叉树的最小深度
last_update:
  date: 12/29/2022
  author: 高红翔
---

## 题目

给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

**说明：**叶子节点是指没有子节点的节点。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/10/12/ex_depth.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：2
```

**示例 2：**

```
输入：root = [2,null,3,null,4,null,5,null,6]
输出：5
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/minimum-depth-of-binary-tree/

## 答案

### 递归

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (!root) return 0
  // 到叶子节点 返回 1
  if (!root.left && !root.right) return 1
  // 只有右节点时 递归右节点
  if (!root.left) return 1 + minDepth(root.right)
  // 只有左节点时 递归左节点
  if (!root.right) return 1 + minDepth(root.left)
  return Math.min(minDepth(root.left), minDepth(root.right)) + 1
}
```

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (!root) return 0
  const queue = [root]
  let dep = 0
  while (true) {
    let size = queue.length
    dep++
    while (size--) {
      const node = queue.shift()
      // 到第一个叶子节点 返回 当前深度
      if (!node.left && !node.right) return dep
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
  }
}
```
