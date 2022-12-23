---
title: 组合-77
description: 回溯 递归
last_update:
  date: 11/18/2022
  author: 高红翔
---

## 题目

给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。

你可以按 **任何顺序** 返回答案。

**示例 1：**

```
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

**示例 2：**

```
输入：n = 1, k = 1
输出：[[1]]
```

## 答案

```js
var combine = function (n, k) {
  let result = [] //存放符合条件结果的集合
  let path = [] //用来存放符合条件结果
  // startIndex 开始搜索的位置
  const combineHelper = (n, k, startIndex) => {
    if (path.length === k) {
      //回溯函数终止条件
      result.push([...path])
      return
    }
    //优化剪支 当剩下的子叶小于需要需要的子叶时候停止
    for (let i = startIndex; i <= n - (k - path.length) + 1; ++i) {
      path.push(i) //处理节点
      combineHelper(n, k, i + 1) //递归
      path.pop() //回溯，撤销处理的节点
    }
  }
  combineHelper(n, k, 1)
  return result
}
```
