---
title: 平衡二叉树
last_update:
  date: 12/29/2022
  author: zhongnan
---

## 题目

给定一个**二叉树**，判断它是否是高度平衡的二叉树.

**平衡二叉树**的定义如下：一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：true
```
**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/10/06/balance_2.jpg)

```
输入：root = [1,2,2,3,3,null,null,4,4]
输出：false
```
来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/balanced-binary-tree/

## 答案

### 递归法

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
    let flag = true
    var maxDepth = (root) => {
        if(!root) return 0
        let leftMax = maxDepth(root.left)
        let righttMax = maxDepth(root.right)
        if(Math.abs(leftMax - righttMax) > 1){
            flag = false
        }
        return 1 + Math.max(leftMax,righttMax)
    }
    maxDepth(root)
    return flag

};
```

### 迭代法

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
    if (root === null) return true;
    const getHeight = (curNode) => {
        if (curNode === null) return 0;
        const stack = [];
        stack.push(curNode);
        let depth = 0,
            res = 0;

        while (stack.length) {
            let node = stack[stack.length - 1];

            if (node !== null) {
                stack.push(null);
                depth++;
                node.right && stack.push(node.right);
                node.left && stack.push(node.left);
            } else {
                stack.pop();
                node = stack[stack.length - 1];
                stack.pop();
                depth--;
            }
            res = Math.max(res, depth);
        }
        return res;
    }

    const stack = [];
    stack.push(root);

    while(stack.length) {
        const node = stack.pop();
        if (Math.abs(getHeight(node.left) - getHeight(node.right)) > 1) {
            return false;
        }
        node.right && stack.push(node.right);
        node.left && stack.push(node.left);
    }
    return true;

};
```
