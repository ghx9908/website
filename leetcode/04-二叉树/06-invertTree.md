---
title: 6. 翻转二叉树
last_update:
  date: 12/29/2022
  author: 高红翔
---

## 题目

- 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

  **示例 1：**

  ![img](https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg)

  ```
  输入：root = [4,2,7,1,3,6,9]
  输出：[4,7,2,9,6,3,1]
  ```

  **示例 2：**

  ![img](https://assets.leetcode.com/uploads/2021/03/14/invert2-tree.jpg)

  ```
  输入：root = [2,1,3]
  输出：[2,3,1]
  ```

  **示例 3：**

  ```
  输入：root = []
  输出：[]
  ```

  **提示：**

  - 树中节点数目范围在 `[0, 100]` 内
  - `-100 <= Node.val <= 100`

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/invert-binary-tree/

## 思路

本题利用二分查找来求解，一开始把右边界粗略的设定为目标值 `x`，左右边界的中间值设为 `middle`，然后在二分过程中每次发现 `middle * middle` < `x` 的情况，就把这个 `middle` 值记录为`ans`。

如果计算出的乘积正好等于 `x`，就直接返回这个`mid` 值。

如果二分查找超出边界了，无论最后的边界是停留在小于 `x` 的位置还是大于 `x` 的位置，都返回 `ans` 即可，因为它是最后一个乘积小于 `x` 的值，一定是正确答案。

## 答案

### 递归

- 前序

```js
var invertTree = function (root) {
  // 终止条件
  if (!root) {
    return null
  }

  // 中 交换左右节点
  const rightNode = root.right
  root.right = root.left
  root.left = rightNode

  invertTree(root.left) //左
  invertTree(root.right) //右
  return root
}
```

- 后序

```js
var invertTree = function (root) {
  // 终止条件
  if (!root) {
    return null
  }

  invertTree(root.left) //左
  invertTree(root.right) //右
  // 中 交换左右节点
  const rightNode = root.right
  root.right = root.left
  root.left = rightNode

  return root
}
```

- 中序

```js
var invertTree = function (root) {
  // 终止条件
  if (!root) {
    return null
  }

  invertTree(root.left) //左

  // 中 交换左右节点
  const rightNode = root.right
  root.right = root.left
  root.left = rightNode
  invertTree(root.left) //右 不能在是rightNode 因为经过中序遍历已经翻转了
  return root
}
```

### 迭代

- 深度优先遍历(前序)

```js
const invertTree = function (root) {
  // 处理边界条件
  if (!root) {
    return root
  }
  // 初始化栈结构
  const stack = []
  // 首先将根结点入栈
  stack.push(root)
  // 若栈不为空，则重复出栈、入栈操作
  while (stack.length) {
    // 将栈顶结点记为当前结点
    const cur = stack.pop()
    //处理当前节点
    const curRight = cur.right
    cur.right = cur.left
    cur.left = curRight
    // 若当前子树根结点有右孩子，则将右孩子入栈
    if (cur.right) {
      stack.push(cur.right)
    }
    // 若当前子树根结点有左孩子，则将左孩子入栈
    if (cur.left) {
      stack.push(cur.left)
    }
  }
  return root
}
```

- 广度优先遍历（层序遍历）

```js
const invertTree = function (root) {
  if (!root) return root
  const queue = [root] // 初始化队列queue
  queue.push()
  // 队列不为空，说明没有遍历完全
  while (queue.length) {
    const top = queue.shift() // 取出队头元素
    //处理当前节点
    const topRight = top.right
    top.right = top.left
    top.left = topRight
    // 左右节点入队
    if (top.left) queue.push(top.left)
    if (top.right) queue.push(top.right)
  }
  return root
}
```
