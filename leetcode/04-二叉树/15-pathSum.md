---
title: 路径总和
last_update:
  date: 01/03/2023
  author: zhongnan
---

## 题目

给你二叉树的根节点 `root` 和一个表示目标和的整数 `targetSum` 。判断该树中是否存在 **根节点到叶子节点** 的路径，这条路径上所有节点值相加等于目标和 `targetSum` 。如果存在，返回 `true` ；否则，返回 `false` 。

**叶子节点 是指没有子节点的节点。**


**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg)

```
输入: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
输出: true
解释: 等于目标和的根节点到叶节点路径如上图所示
```

**示例 2:**


![img](https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg)

```
输入: root = [1,2,3], targetSum = 5
输出: false
```

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/path-sum/

## 答案

### 迭代法

```js
/**
 * @param {treenode} root
 * @param {number} targetsum
 * @return {boolean}
 */
let hasPathSum = function(root, targetSum) {
    if(root === null) return false;
    let nodeArr = [root];
    let valArr = [0];
    while(nodeArr.length) {
        let curNode = nodeArr.shift();
        let curVal = valArr.shift();
        curVal += curNode.val;
        // 为叶子结点，且和等于目标数，返回true
        if (curNode.left === null && curNode.right === null && curVal === targetSum) {
            return true;
        }
        // 左节点，将当前的数值也对应记录下来
        if (curNode.left) {
            nodeArr.push(curNode.left);
            valArr.push(curVal);
        }
        // 右节点，将当前的数值也对应记录下来
        if (curNode.right) {
            nodeArr.push(curNode.right);
            valArr.push(curVal);
        }
    }
    return false;
};
```

### 递归法

```js
/**
 * @param {treenode} root
 * @param {number} targetsum
 * @return {boolean}
 */
let haspathsum = function (root, targetsum) {
  // 递归法
  const traversal = (node, cnt) => {
    // 遇到叶子节点，并且计数为0
    if (cnt === 0 && !node.left && !node.right) return true;
    // 遇到叶子节点而没有找到合适的边(计数不为0)，直接返回
    if (!node.left && !node.right) return false;

    //  左（空节点不遍历）.遇到叶子节点返回true，则直接返回true
    if (node.left && traversal(node.left, cnt - node.left.val)) return true;
    //  右（空节点不遍历）  
    if (node.right && traversal(node.right, cnt - node.right.val)) return true;
    return false;
  };
  if (!root) return false;
  return traversal(root, targetsum - root.val);

  // 精简代码:
  // if (!root) return false;
  // if (!root.left && !root.right && targetsum === root.val) return true;
  // return haspathsum(root.left, targetsum - root.val) || haspathsum(root.right, targetsum - root.val);
};
```
