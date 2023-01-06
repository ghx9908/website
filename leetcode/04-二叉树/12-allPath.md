---
title: 12. 二叉树的所有路径
last_update:
  date: 12/29/2022
  author: zhongnan
---

## 题目

给定一个**二叉树**，返回所有从根节点到叶子节点的路径。

说明: 叶子节点是指没有子节点的节点。

**示例 1：**

![img](https://img-blog.csdnimg.cn/2021020415161576.png)

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/binary-tree-paths/

## 答案

### 递归法

```js
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function (root) {
  //递归遍历+递归三部曲
  let res = []
  //1. 确定递归函数 函数参数
  const getPath = function (node, curPath) {
    //2. 确定终止条件，到叶子节点就终止
    if (node.left === null && node.right === null) {
      curPath += node.val
      res.push(curPath)
      return
    }
    //3. 确定单层递归逻辑
    curPath += node.val + "->"
    node.left && getPath(node.left, curPath)
    node.right && getPath(node.right, curPath)
  }
  getPath(root, "")
  return res
}
```

### 迭代法

```js
var binaryTreePaths = function (root) {
  if (!root) return []
  const stack = [root],
    paths = [""],
    res = []
  while (stack.length) {
    const node = stack.pop()
    let path = paths.pop()
    if (!node.left && !node.right) {
      // 到叶子节点终止, 添加路径到结果中
      res.push(path + node.val)
      continue
    }
    path += node.val + "->"
    if (node.right) {
      // 右节点存在
      stack.push(node.right)
      paths.push(path)
    }
    if (node.left) {
      // 左节点存在
      stack.push(node.left)
      paths.push(path)
    }
  }
  return res
}
```
