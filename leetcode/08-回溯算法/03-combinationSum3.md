---
title: 组合-77
description: 回溯 递归
last_update:
  date: 11/18/2022
  author: 高红翔
---

## 题目

找出所有相加之和为 n 的 k 个数的组合。组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字。

说明：

- 所有数字都是正整数。
- 解集不能包含重复的组合。

示例 1: 输入: k = 3, n = 7 输出: [[1,2,4]]

示例 2: 输入: k = 3, n = 9 输出: [[1,2,6], [1,3,5], [2,3,4]]

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/combination-sum-iii/description/

## 答案

```js
var combinationSum3 = function (k, n) {
  const res = []
  const path = []
  const bfc = (targetSum, indexStart) => {
    if (path.length === k) {
      if (targetSum === 0) res.push([...path])
      return
    }
    for (let i = indexStart; i <= 9; i++) {
      path.push(i)
      bfc(targetSum - i, i + 1)
      path.pop()
    }
  }
  bfc(n, 1)
  return res
}
```

## 优化

```js
var combinationSum3 = function (k, n) {
  const res = []
  const path = []
  const bfc = (targetSum, indexStart) => {
    if (path.length === k) {
      if (targetSum === 0) res.push([...path])
      return
    }
    for (let i = indexStart; i <= 9 - (k - path.length) + 1; i++) {
      if (targetSum - i >= 0) {
        path.push(i)
        bfc(targetSum - i, i + 1)
        path.pop()
      } else {
        continue
      }
    }
  }
  bfc(n, 1)
  return res
}
```
