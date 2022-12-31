---
title: 找树左下角的值
last_update:
  date: 12/31/2022
  author: 高红翔
---

## 题目

给定二叉树的根节点 `root` ，返回所有左叶子之和。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/04/08/leftsum-tree.jpg)

```
输入: root = [3,9,20,null,null,15,7]
输出: 24
解释: 在这个二叉树中，有两个左叶子，分别是 9 和 15，所以返回 24
```

**示例 2:**

```
输入: root = [1]
输出: 0
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/sum-of-left-leaves/description/

## 答案

### 迭代法

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var findBottomLeftValue = function (root) {
  //考虑层序遍历 记录最后一行的第一个节点
  let queue = []
  if (root === null) {
    return null
  }
  queue.push(root)
  let resNode
  while (queue.length) {
    let length = queue.length
    for (let i = 0; i < length; i++) {
      let node = queue.shift()
      if (i === 0) {
        resNode = node.val
      }
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
  }
  return resNode
}
```

### 递归法

```js
var findBottomLeftValue = function (root) {
  //首先考虑递归遍历 前序遍历 找到最大深度的叶子节点即可
  let maxPath = 0,
    resNode = null
  // 1. 确定递归函数的函数参数
  const dfsTree = function (node, curPath) {
    // 2. 确定递归函数终止条件
    if (node.left === null && node.right === null) {
      if (curPath > maxPath) {
        maxPath = curPath
        resNode = node.val
      }
    }
    node.left && dfsTree(node.left, curPath + 1)
    node.right && dfsTree(node.right, curPath + 1)
  }
  dfsTree(root, 1)
  return resNode
}
```
