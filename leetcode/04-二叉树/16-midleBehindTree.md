---
title: 16. 从中序与后序遍历序列构造二叉树
last_update:
  date: 01/03/2023
  author: zhongnan
---

## 题目

给定两个整数数组 `inorder` 和 `postorder` ，其中 `inorder` 是二叉树的中序遍历， `postorder` 是同一棵树的后序遍历，请你构造并返回这颗 **二叉树** 。


**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

```
输入: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
输出: [3,9,20,null,null,15,7]

```

**示例 2:**

```
输入: inorder = [-1], postorder = [-1]
输出: [-1]
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/

## 答案

### 迭代法

```js
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    if (postorder.length === 0) {
        return null;
    }
    const n = inorder.length;
    let postIndex = n-1;
    const rootVal = postorder[postIndex];
    const root = new TreeNode(rootVal);
    const stack = [];
    let inorderIndex = n-1;
    stack.push(root);
    for (postIndex--; postIndex >= 0; postIndex--) {
        let peek = stack[stack.length-1]
        const cur = new TreeNode(postorder[postIndex]);
        if (peek.val !== inorder[inorderIndex]) {
            peek.right = cur;
        } else {
            let fatherNode;
            while (stack.length && stack[stack.length-1].val === inorder[inorderIndex]) {
                fatherNode = stack.pop();
                inorderIndex--;
            }
            fatherNode.left = cur;
        }
        stack.push(cur);
    }
    return root;
};

```

### 递归法

```js
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    if (!postorder.length) return null;  //后续的最后一个元素为中心节点（根节点）
    const top = postorder.pop();//取中心节点（根节点）
    const root = new TreeNode(top); //创建一个新树
    const topIndex = inorder.indexOf(top);//切割左区间和右区间
    // 递归左区间和右区间
    root.left = buildTree(inorder.slice(0, topIndex), postorder.slice(0, topIndex));
    root.right = buildTree(inorder.slice(topIndex + 1), postorder.slice(topIndex));
    return root;
};
```
