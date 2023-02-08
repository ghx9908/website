---
title: 4. 有序数组的平方 - 977
description: 双指针
last_update:
  date: 02/08/2023
  author: 高红翔
---

给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/squares-of-a-sorted-array/description/

## 🧠 解题思路

### 首尾指针

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  let res = []
  let l = 0,
    r = nums.length - 1
  while (l <= r) {
    if (Math.pow(nums[l], 2) > Math.pow(nums[r], 2)) {
      res.unshift(Math.pow(nums[l++], 2))
    } else {
      res.unshift(Math.pow(nums[r--], 2))
    }
  }

  return res
}
```

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  let n = nums.length
  let res = Array(n).fill(0)
  let l = 0,
    r = n - 1,
    k = n - 1
  while (l <= r) {
    if (Math.pow(nums[l], 2) > Math.pow(nums[r], 2)) {
      res[k--] = Math.pow(nums[l++], 2)
    } else {
      res[k--] = Math.pow(nums[r--], 2)
    }
  }

  return res
}
```
