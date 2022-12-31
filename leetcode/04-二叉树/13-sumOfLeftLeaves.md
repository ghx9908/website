---
title: 左叶子之和
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

### 递归法

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
//采用前序遍历
var sumOfLeftLeaves = function (root) {
  let res = 0
  if (!root) return res
  helper(root)
  function helper(node) {
    if (node.left && !node.left.left && !node.left.right) {
      res += node.left.val
    }
    node.left && helper(node.left)

    node.right && helper(node.right)
  }

  return res
}
```
