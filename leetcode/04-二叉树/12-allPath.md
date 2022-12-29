---
title: 二叉树的所有路径
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
var binaryTreePaths = function(root) {
    if(!root) return []
    const paths = []
    const path_sum = (node,path)=>{
        if(!node) return []
        path += node.val.toString()
        if(node.left ===null && node.right===null){
            paths.push(path)
        }else{
            path +='->'
            path_sum(node.left,path)
            path_sum(node.right,path)
        }
    }
    path_sum(root,'')
    return paths

};
```

### 迭代法

```js
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {


    var searchTreePaths = function(tree, str, arr) {
        if (tree != null) {
            str = str+tree.val;
        }
        else {
            return;
        }

        if (tree.left == null && tree.right == null) {
            arr.push(str);
        }
        else {
            str = str + '->';
            searchTreePaths(tree.left, str, arr);
            searchTreePaths(tree.right, str, arr);
        }


    }
    var str = '';
    var arr = [];
    searchTreePaths(root, str, arr);
    return arr;
};
```
