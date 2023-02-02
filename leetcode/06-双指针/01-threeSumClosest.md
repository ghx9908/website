---
title: 1. 最接近的三数之和-16
description: 考察双指针
last_update:
  date: 11/15/2022
  author: your name
---

给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。

```
示例：

输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
```

提示：

```
3 <= nums.length <= 10^3`
`-10^3 <= nums[i] <= 10^3`
`-10^4 <= target <= 10^4
```

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/3sum-closest

## 思路

先按照升序排序，然后分别从左往右依次选择一个基础点 `i`（`0 <= i <= nums.length - 3`），在基础点的右侧用双指针去不断的找最小的差值。

假设基础点是 `i`，初始化的时候，双指针分别是：

- **`left`**：`i + 1`，基础点右边一位。
- **`right`**: `nums.length - 1` 数组最后一位。

然后求此时的和，如果和大于 `target`，那么可以把右指针左移一位，去试试更小一点的值，反之则把左指针右移。

在这个过程中，不断更新全局的最小差值 `min`，和此时记录下来的和 `res`。

最后返回 `res` 即可。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
let threeSumClosest = function (nums, target) {
  let n = nums.length
  if (n === 3) {
    return getSum(nums)
  }
  // 先升序排序 此为解题的前置条件
  nums.sort((a, b) => a - b)

  let min = Infinity // 和 target 的最小差
  let res

  // 从左往右依次尝试定一个基础指针 右边至少再保留两位 否则无法凑成3个
  for (let i = 0; i <= nums.length - 3; i++) {
    let basic = nums[i]
    let left = i + 1 // 左指针先从 i 右侧的第一位开始尝试
    let right = n - 1 // 右指针先从数组最后一项开始尝试

    while (left < right) {
      let sum = basic + nums[left] + nums[right] // 三数求和
      // 更新最小差
      let diff = Math.abs(sum - target)
      if (diff < min) {
        min = diff
        res = sum
      }
      if (sum < target) {
        // 求出的和如果小于目标值的话 可以尝试把左指针右移 扩大值
        left++
      } else if (sum > target) {
        // 反之则右指针左移
        right--
      } else {
        // 相等的话 差就为0 一定是答案
        return sum
      }
    }
  }

  return res
}

function getSum(nums) {
  return nums.reduce((total, cur) => total + cur, 0)
}
```
