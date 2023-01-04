---
title: 4. 二叉树的统一迭代法
description: 栈实现
last_update:
  date: 12/26/2022
  author: 高红翔
---

## 题目

给你二叉树的根节点 root ，返回它节点值的 前序 中序 后续 遍历。

- [144.二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
- [94.二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
- [145.二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)

## 思路

- 统一迭代法
- 栈

## 解题

### 前序遍历

```js
var preorderTraversal = function (root) {
  const res = []
  if (!root) return res //边界处理
  const stack = [root] //初始化栈
  while (stack.length) {
    const node = stack.pop() //取出最后放进去的节点
    if (!node) {
      res.push(stack.pop().val) //取值放入结果中
      continue //结束本次循环，否则有回放入 node 和null 陷入死循环
    }
    //放入栈中的顺序  前序： 右 左 中 null
    if (node.right) stack.push(node.right) // 右
    if (node.left) stack.push(node.left) // 左
    stack.push(node) // 中
    stack.push(null) //空指针占位 循环时遇到空指针处理结果
  }
  return res
}
```

### 中序遍历

```js
var inorderTraversal = function (root) {
  const res = []
  if (!root) return res //边界处理
  const stack = [root] //初始化栈
  while (stack.length) {
    const node = stack.pop() //取出最后放进去的节点
    if (!node) {
      res.push(stack.pop().val) //取值放入结果中
      continue //结束本次循环，否则有回放入 node 和null 陷入死循环
    }
    //放入栈中的顺序   中序： 右  中 null 左
    if (node.right) stack.push(node.right) // 右
    stack.push(node) // 中
    stack.push(null) //空指针占位 循环时遇到空指针处理结果
    if (node.left) stack.push(node.left) // 左
  }
  return res
}
```

### 后序遍历

```js
var postorderTraversal = function (root) {
  const res = []
  if (!root) return res //边界处理
  const stack = [root] //初始化栈
  while (stack.length) {
    const node = stack.pop() //取出最后放进去的节点
    if (!node) {
      res.push(stack.pop().val) //取值放入结果中
      continue //结束本次循环，否则有回放入 node 和null 陷入死循环
    }
    //放入栈中的顺序  后序 中 null 右 左
    stack.push(node) // 中
    stack.push(null) //空指针占位 循环时遇到空指针处理结果
    if (node.right) stack.push(node.right) // 右
    if (node.left) stack.push(node.left) // 左
  }
  return res
}
```
