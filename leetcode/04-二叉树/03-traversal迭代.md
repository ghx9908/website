---
title: 二叉树的迭代遍历
description: 考察深度优先遍历 递归+迭代
last_update:
  date: 12/25/2022
  author: 钟男
---

## 题目

给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,2,3]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**示例 4：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg)

```
输入：root = [1,2]
输出：[1,2]
```

**示例 5：**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg)

```
输入：root = [1,null,2]
输出：[1,2]
```

**提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

**进阶：**递归算法很简单，你可以通过迭代算法完成吗？

来源：力扣（LeetCode）

- [144.二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
- [94.二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
- [145.二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)

## 思路

### 迭代法

- 为什么可以用迭代法（非递归的方式）来实现二叉树的前后中序遍历呢？

- 递归的实现就是：每一次递归调用都会把函数的局部变量、参数值和返回地址等压入调用栈中，然后递归返回的时候，从栈顶弹出上一次递归的各项参数，所以这就是递归为什么可以返回上一层位置的原因。

此时大家应该知道我们用栈也可以是实现二叉树的前后中序遍历了。

## 解题

### 前序遍历

```js
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
const preorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 处理边界条件
  if (!root) {
    return res
  }
  // 初始化栈结构
  const stack = []
  // 首先将根结点入栈
  stack.push(root)
  // 若栈不为空，则重复出栈、入栈操作
  while (stack.length) {
    // 将栈顶结点记为当前结点
    const cur = stack.pop()
    // 当前结点就是当前子树的根结点，把这个结点放在结果数组的尾部
    res.push(cur.val)
    // 若当前子树根结点有右孩子，则将右孩子入栈
    if (cur.right) {
      stack.push(cur.right)
    }
    // 若当前子树根结点有左孩子，则将左孩子入栈
    if (cur.left) {
      stack.push(cur.left)
    }
  }
  // 返回结果数组
  return res
}
```

### 后序遍历

```js
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
const postorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 处理边界条件
  if (!root) {
    return res
  }
  // 初始化栈结构
  const stack = []
  // 首先将根结点入栈
  stack.push(root)
  // 若栈不为空，则重复出栈、入栈操作
  while (stack.length) {
    // 将栈顶结点记为当前结点
    const cur = stack.pop()
    // 当前结点就是当前子树的根结点，把这个结点放在结果数组的头部
    res.unshift(cur.val)
    // 若当前子树根结点有左孩子，则将左孩子入栈
    if (cur.left) {
      stack.push(cur.left)
    }
    // 若当前子树根结点有右孩子，则将右孩子入栈
    if (cur.right) {
      stack.push(cur.right)
    }
  }
  // 返回结果数组
  return res
}
```

### 中序遍历

```js
const inorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 初始化栈结构
  const stack = []
  // 用一个 cur 结点充当游标
  let cur = root
  // 当 cur 不为空、或者 stack 不为空时，重复以下逻辑
  while (cur || stack.length) {
    // 这个 while 的作用是把寻找最左叶子结点的过程中，途径的所有结点都记录下来
    while (cur) {
      // 将途径的结点入栈
      stack.push(cur)
      // 继续搜索当前结点的左孩子
      cur = cur.left
    }
    // 取出栈顶元素
    cur = stack.pop()
    // 将栈顶元素入栈
    res.push(cur.val)
    // 尝试读取 cur 结点的右孩子
    cur = cur.right
  }
  // 返回结果数组
  return res
}
```
