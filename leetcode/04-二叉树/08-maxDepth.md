---
title: 8. 二叉树的最大深度
last_update:
  date: 12/29/2022
  author: 高红翔
---

## 题目

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**说明:** 叶子节点是指没有子节点的节点。

**示例：**
给定二叉树 `[3,9,20,null,null,15,7]`，

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度 3 。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/maximum-depth-of-binary-tree/

## 思路

本题可以使用前序（中左右），也可以使用后序遍历（左右中），使用前序求的就是深度，使用后序求的是高度。

- 二叉树节点的深度：指从根节点到该节点的最长简单路径边的条数或者节点数（取决于深度从 0 开始还是从 1 开始）
- 二叉树节点的高度：指从该节点到叶子节点的最长简单路径边的条数后者节点数（取决于高度从 0 开始还是从 1 开始）

## 答案

### 递归

#### 后序

```js
var maxdepth = function (root) {
  //使用递归的方法 递归三部曲
  //1. 确定递归函数的参数和返回值
  const getdepth = function (node) {
    //2. 确定终止条件
    if (node === null) {
      return 0
    }
    //3. 确定单层逻辑
    let leftdepth = getdepth(node.left) //左
    let rightdepth = getdepth(node.right) //右
    let depth = 1 + Math.max(leftdepth, rightdepth) //中
    return depth
  }
  return getdepth(root)
}
```

#### 前序 （递归+回溯）

```js
var maxDepth = function (root) {
  //使用递归的方法 递归三部曲
  //1. 确定递归函数的参数和返回值
  const getdepth = function (node, depth) {
    result = depth > result ? depth : result // 中
    //2. 确定终止条件
    if (node.left === null && node.right === null) return
    //3. 确定单层逻辑
    if (node.left) {
      // 左
      depth++ // 深度+1
      getdepth(node.left, depth)
      depth-- // 回溯，深度-1
    }
    if (node.right) {
      // 右
      depth++ // 深度+1
      getdepth(node.right, depth)
      depth-- // 回溯，深度-1
    }

    // if (node.left) {
    //   getdepth(node.left, depth + 1)
    // }
    // if (node.right) {
    //   getdepth(node.right, depth - 1)
    // }
  }
  let result = 0
  if (root == null) return result
  getdepth(root, 1)
  return result
}
```

## 迭代

```js
//层序遍历
var maxDepth = function (root) {
  let res = 0
  if (root === null) return res
  let queue = [root] //根节点入队
  // while 循环控制从上向下一层层遍历
  while (queue.length) {
    res++
    let size = queue.length //本次遍历的数量
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < size; i++) {
      let cur = queue.shift()
      //左右节点入队
      if (cur.left != null) queue.push(cur.left)
      if (cur.right != null) queue.push(cur.right)
    }
  }
  return res
}
```
