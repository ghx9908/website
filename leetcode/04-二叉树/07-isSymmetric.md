---
title: 7. 对称二叉树
last_update:
  date: 12/29/2022
  author: 高红翔
---

## 题目

- 给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

  **示例 1：**

  ![img](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

  ```
  输入：root = [1,2,2,3,4,4,3]
  输出：true
  ```

  **示例 2：**

  ![img](https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg)

  ```
  输入：root = [1,2,2,null,3,null,3]
  输出：false
  ```

  **提示：**

  - 树中节点数目在范围 `[1, 1000]` 内
  - `-100 <= Node.val <= 100`

  **进阶：**你可以运用递归和迭代两种方法解决这个问题吗？

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/symmetric-tree/

## 答案

### 递归

**三部曲**

1.  确定递归函数的参数和返回值
    > 因为我们要比较的是根节点的两个子树是否是相互翻转的，进而判断这个树是不是对称树，所以要比较的是两个树，参数自然也是左子树节点和右子树节点。

返回值自然是 bool 类型。

2. 确定终止条件

- 左节点为空，右节点不为空，不对称，return false
- 左不为空，右为空，不对称 return false
- 左右都为空，对称，返回 true
- 左右都不为空，比较节点数值，不相同就 return false

3. 确定单层递归的逻辑

```js
let outSide = compareNode(left.left, right.right)
let inSide = compareNode(left.right, right.left)
return outSide && inSide
```

#### **后序**

```js
var isSymmetric = function (root) {
  // 使用递归遍历左右子树 递归三部曲
  // 1. 确定递归的参数 root.left root.right和返回值true false
  const compareNode = function (left, right) {
    // 2. 确定终止条件 空的情况
    if (
      (left === null && right !== null) ||
      (left !== null && right === null)
    ) {
      return false
    } else if (left === null && right === null) {
      return true
    } else if (left.val !== right.val) {
      return false
    }
    // 3. 确定单层递归逻辑
    let outSide = compareNode(left.left, right.right)
    let inSide = compareNode(left.right, right.left)
    return outSide && inSide
  }
  if (root === null) {
    return true
  }
  return compareNode(root.left, root.right)
}
```

## 迭代

- 利用队列

```js
var isSymmetric = function (root) {
  // 迭代方法判断是否是对称二叉树
  // 首先判断root是否为空
  if (root === null) {
    return true
  }
  let queue = []
  queue.push(root.left)
  queue.push(root.right)
  while (queue.length) {
    let leftNode = queue.shift() //左节点
    let rightNode = queue.shift() //右节点
    // 提前结束
    if (leftNode === null && rightNode === null) {
      continue
    }
    //中止条件
    if (
      leftNode === null ||
      rightNode === null ||
      leftNode.val !== rightNode.val
    ) {
      return false
    }
    queue.push(leftNode.left) //左节点左孩子入队
    queue.push(rightNode.right) //右节点右孩子入队
    queue.push(leftNode.right) //左节点右孩子入队
    queue.push(rightNode.left) //右节点左孩子入队
  }

  return true
}
```

- 利用栈

```js
var isSymmetric = function (root) {
  // 迭代方法判断是否是对称二叉树
  // 首先判断root是否为空
  if (root === null) {
    return true
  }
  let stack = []
  stack.push(root.left)
  stack.push(root.right)
  while (stack.length) {
    let rightNode = stack.pop() //左节点
    let leftNode = stack.pop() //右节点
    if (leftNode === null && rightNode === null) {
      continue
    }
    if (
      leftNode === null ||
      rightNode === null ||
      leftNode.val !== rightNode.val
    ) {
      return false
    }
    stack.push(leftNode.left) //左节点左孩子入队
    stack.push(rightNode.right) //右节点右孩子入队
    stack.push(leftNode.right) //左节点右孩子入队
    stack.push(rightNode.left) //右节点左孩子入队
  }

  return true
}
```
