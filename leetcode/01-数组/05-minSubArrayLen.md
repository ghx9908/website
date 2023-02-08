---
title: 5. 209. 长度最小的子数组 -209
description: 双指针 滑动窗口
last_update:
  date: 02/08/2023
  author: 高红翔
---

给定一个含有 n 个正整数的数组和一个正整数 target 。

找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/minimum-size-subarray-sum/description/

## 🧠 解题思路

### 首尾指针

```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  let res = Infinity,
    sum = 0,
    l = 0
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r]
    while (sum >= target) {
      res = Math.min(r - l + 1, res)
      sum -= nums[l++]
    }
  }
  return res === Infinity ? 0 : res
}
```
