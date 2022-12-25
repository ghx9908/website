---
title:  二叉树的前中后序
description: 考察二分查找
last_update:
  date: 12/25/2022
  author: 钟男
---

## 题目

**递归法**

这次我们要好好谈一谈递归，为什么很多同学看递归算法都`一看就会，一写就废`。

本篇将介绍前后中序的递归写法，一些同学可能会感觉很简单，其实不然，**我们要通过简单题目把方法论确定下来，有了方法论，后面才能应付复杂的递归**。

这里帮助大家确定下来递归算法的**三个要素**。每次写递归，都按照这三要素来写，可以保证大家写出正确的递归算法！

1. 确定递归函数的参数和返回值： 确定哪些参数是递归的过程中需要处理的，那么就在递归函数里加上这个参数， 并且还要明确每次递归的返回值是什么进而确定递归函数的返回类型。

2. 确定终止条件： 写完了递归算法, 运行的时候，经常会遇到栈溢出的错误，就是没写终止条件或者终止条件写的不对，操作系统也是用一个栈的结构来保存每一层递归的信息，如果递归没有终止，操作系统的内存栈必然就会溢出。

3. 确定单层递归的逻辑： 确定每一层递归需要处理的信息。在这里也就会重复调用自己来实现递归的过程。

**以下以前序遍历为例：**

- 确定递归函数的参数和返回值：因为要打印出前序遍历节点的数值，所以参数里需要传入vector在放节点的数值，除了这一点就不需要在处理什么数据了也不需要有返回值，所以递归函数返回类型就是void，代码如下：
```js
void traversal(TreeNode* cur, vector<int>& vec)
```
- 确定终止条件：在递归的过程中，如何算是递归结束了呢，当然是当前遍历的节点是空了，那么本层递归就要要结束了，所以如果当前遍历的这个节点是空，就直接return，代码如下：
```js
if (cur == NULL) return;
```
- 确定单层递归的逻辑：前序遍历是中左右的循序，所以在单层递归的逻辑，是要先取中节点的数值，代码如下：
```js
vec.push_back(cur->val);    // 中
traversal(cur->left, vec);  // 左
traversal(cur->right, vec); // 右
```
## 代码如下
```js
var preorderTraversal = function (root) {
  // 首先声明一个数组用来存放遍历得到的节点val值
  const result = []
  // 采用递归遍历
  function preorder(node) {
    // 如果节点为空直接返回
    if (!node) return
    // 先序遍历就是把当前节点输出 放在左右递归调用之前 将其数值放入结果数组
    result.push(node.val)
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

**迭代法**

- 为什么可以用迭代法（非递归的方式）来实现二叉树的前后中序遍历呢？

- 递归的实现就是：每一次递归调用都会把函数的局部变量、参数值和返回地址等压入调用栈中，然后递归返回的时候，从栈顶弹出上一次递归的各项参数，所以这就是递归为什么可以返回上一层位置的原因。

此时大家应该知道我们用栈也可以是实现二叉树的前后中序遍历了。

1. 前序
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
2. 后序
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
3. 中序
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
  ```