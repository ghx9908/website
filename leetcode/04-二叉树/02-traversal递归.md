---
title: 2. 二叉树的递归遍历
description: 考察深度优先遍历 递归法
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

### **递归法**

这次我们要好好谈一谈递归，为什么很多同学看递归算法都`一看就会，一写就废`。

本篇将介绍前后中序的递归写法，一些同学可能会感觉很简单，其实不然，**我们要通过简单题目把方法论确定下来，有了方法论，后面才能应付复杂的递归**。

这里帮助大家确定下来递归算法的**三个要素**。每次写递归，都按照这三要素来写，可以保证大家写出正确的递归算法！

1. 确定递归函数的参数和返回值： 确定哪些参数是递归的过程中需要处理的，那么就在递归函数里加上这个参数， 并且还要明确每次递归的返回值是什么进而确定递归函数的返回类型。

2. 确定终止条件： 写完了递归算法, 运行的时候，经常会遇到栈溢出的错误，就是没写终止条件或者终止条件写的不对，操作系统也是用一个栈的结构来保存每一层递归的信息，如果递归没有终止，操作系统的内存栈必然就会溢出。

3. 确定单层递归的逻辑： 确定每一层递归需要处理的信息。在这里也就会重复调用自己来实现递归的过程。

**以下以前序遍历为例：**

- 确定递归函数的参数和返回值：因为要打印出前序遍历节点的数值，所以参数里需要传入 node 在放节点的数值，除了这一点就不需要在处理什么数据了也不需要有返回值，所以递归函数返回类型就是 void，代码如下：

```js
function preorder(node, result) {}
```

- 确定终止条件：在递归的过程中，如何算是递归结束了呢，当然是当前遍历的节点是空了，那么本层递归就要要结束了，所以如果当前遍历的这个节点是空，就直接 return，代码如下：

```js
if (cur == null) return
```

- 确定单层递归的逻辑：前序遍历是中左右的循序，所以在单层递归的逻辑，是要先取中节点的数值，代码如下：

```js
result.push(node.val) //添加到结果
// 然后递归遍历左孩子
preorder(node.left)
// 最后递归遍历右孩子
preorder(node.right)
```

## 解题 递归

- 参数的返回值
- 终止条件
- 单层循环逻辑

### 前序遍历

```js
var preorderTraversal = function (root) {
  const result = []
  function preorder(node) {
    // 递归的终止条件 如果节点为空直接返回
    if (!node) return //
    // 先序遍历就是把当前节点输出 放在左右递归调用之前 将其数值放入结果数组
    result.push(node.val) //中 处理当前节点
    // 然后递归遍历左孩子
    preorder(node.left)
    // 最后递归遍历右孩子
    preorder(node.right)
  }
  preorder(root)
  // 返回结果
  return result
}
```
