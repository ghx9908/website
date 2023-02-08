---
title: 1. 两数之和-1
description: 考察hasMap
last_update:
  date: 11/15/2022
  author: you name
---

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** _`target`_ 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

**提示：**

- `2 <= nums.length <= 104`
- `-109 <= nums[i] <= 109`
- `-109 <= target <= 109`
- **只会存在一个有效答案**

**进阶：**你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/two-sum/

## 🧠 解题思路

根据题意，如果我们使用暴破，会导致时间复杂度为 n^2，这样的代价无疑是很大的。

所以我们很容易想到用哈希表来解决这个问题。

我们遍历到数字 aaa 时，用 targettargettarget 减去 aaa，就会得到 bbb，若 bbb 存在于哈希表中，我们就可以直接返回结果了。若 bbb 不存在，那么我们需要将 aaa 存入哈希表，好让后续遍历的数字使用。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let map = new Map()
  for (let i = 0; i < nums.length; i++) {
    let
    if (map.has(target - nums[i])) {
      return [map.get(target - nums[i]), i]
    } else {
      map.set(nums[i], i)
    }
  }
  return []
}
```

```js
const twoSum = function (nums, target) {
  // 这里我用对象来模拟 map 的能力
  const diffs = {}
  // 缓存数组长度
  const len = nums.length
  // 遍历数组
  for (let i = 0; i < len; i++) {
    // 判断当前值对应的 target 差值是否存在（是否已遍历过）
    if (diffs[target - nums[i]] !== undefined) {
      // 若有对应差值，那么答案get！
      return [diffs[target - nums[i]], i]
    }
    // 若没有对应差值，则记录当前值
    diffs[nums[i]] = i
  }
}
```
