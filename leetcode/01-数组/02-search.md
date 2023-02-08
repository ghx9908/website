---
title: 2. 二分查找- 704
description: 考察hasMap
last_update:
  date: 02/08/2023
  author: 高红翔
---

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/binary-search/

## 🧠 解题思路

### 二分查找

- 左闭右闭区间 [left, right]

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  // right是数组最后一个数的下标，num[right]在查找范围内，是左闭右闭区间
  let mid,
    left = 0,
    right = nums.length - 1
  // 当left=right时，由于nums[right]在查找范围内，所以要包括此情况
  while (left <= right) {
    // 位运算 + 防止大数溢出
    mid = left + ((right - left) >> 1)
    // 如果中间数大于目标值，要把中间数排除查找范围，所以右边界更新为mid-1；如果右边界更新为mid，那中间数还在下次查找范围内
    if (nums[mid] > target) {
      right = mid - 1 // 去左面闭区间寻找
    } else if (nums[mid] < target) {
      left = mid + 1 // 去右面闭区间寻找
    } else {
      return mid
    }
  }
  return -1
}
```

- 闭右开区间 [left, right)

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  // right是数组最后一个数的下标+1，nums[right]不在查找范围内，是左闭右开区间
  let mid,
    left = 0,
    right = nums.length
  // 当left=right时，由于nums[right]不在查找范围，所以不必包括此情况
  while (left < right) {
    // 位运算 + 防止大数溢出
    mid = left + ((right - left) >> 1)
    // 如果中间值大于目标值，中间值不应在下次查找的范围内，但中间值的前一个值应在；
    // 由于right本来就不在查找范围内，所以将右边界更新为中间值，如果更新右边界为mid-1则将中间值的前一个值也踢出了下次寻找范围
    if (nums[mid] > target) {
      right = mid // 去左区间寻找
    } else if (nums[mid] < target) {
      left = mid + 1 // 去右区间寻找
    } else {
      return mid
    }
  }
  return -1
}
```
