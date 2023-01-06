---
title: 10. 完全二叉树的节点个数
last_update:
  date: 12/29/2022
  author: 高红翔
---

## 题目

给你一棵 **完全二叉树** 的根节点 `root` ，求出该树的节点个数。

[完全二叉树](https://baike.baidu.com/item/完全二叉树/7773232?fr=aladdin) 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 `h` 层，则该层包含 `1~ 2h` 个节点。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/01/14/complete.jpg)

```
输入：root = [1,2,3,4,5,6]
输出：6
```

**示例 2：**

```
输入：root = []
输出：0
```

**示例 3：**

```
输入：root = [1]
输出：1
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/count-complete-tree-nodes/description/

## 答案

### 递归

```js
var countNodes = function (root) {
  //递归法计算二叉树节点数
  // 1. 确定递归函数参数
  const getNodeSum = function (node) {
    //2. 确定终止条件
    if (node === null) {
      return 0
    }
    //3. 确定单层递归逻辑
    let leftNum = getNodeSum(node.left)
    let rightNum = getNodeSum(node.right)
    return leftNum + rightNum + 1
  }
  return getNodeSum(root)
}
```

### 迭代（层序遍历）

```js
var countNodes = function (root) {
  //层序遍历
  let queue = []
  if (root === null) {
    return 0
  }
  queue.push(root)
  let nodeNums = 0
  while (queue.length) {
    let length = queue.length
    while (length--) {
      let node = queue.shift()
      nodeNums++
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
  }
  return nodeNums
}
```

### 利用完全二叉树性质

```js
var countNodes = function (root) {
  //利用完全二叉树的特点
  if (root === null) {
    return 0
  }
  let left = root.left
  let right = root.right
  let leftDepth = 0,
    rightDepth = 0
  while (left) {
    left = left.left
    leftDepth++
  }
  while (right) {
    right = right.right
    rightDepth++
  }
  if (leftDepth == rightDepth) {
    return Math.pow(2, leftDepth + 1) - 1
  }
  return countNodes(root.left) + countNodes(root.right) + 1
}
```
