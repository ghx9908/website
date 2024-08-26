---
title: 7. 最长连续序列 - 128
last_update:
  date: 08/08/2024
  author: 高红翔
---

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/longest-consecutive-sequence
## 🧠 解题思路



### 哈希
```js
var longestConsecutive = function (nums) {
  let res = 0
  let set = new Set(nums)
  for (let num of nums) {
    if (!set.has(num - 1)) {
      let curNum = num
      let len = 1
      while (set.has(curNum + 1)) {
        len++
        curNum++
      }
      res = Math.max(res, len)
    }
  }

  return res
}
```

1. 使用 Set 存储所有数字：这样在查找一个数字是否存在时可以在 O(1) 时间内完成。

2. 判断序列的起点：对于每个数字 num，如果 num-1 不在 Set 中，说明 num 是一个序列的起点（因为 num-1 不存在，无法连接到 num）。然后，从 num 开始查找连续的数字，计算当前序列的长度。

3. 更新最大长度：在遍历的过程中，记录当前发现的最长连续序列的长度。

### 时间复杂度
- 由于每个数字最多只被访问两次（一次是初始遍历，第二次是作为序列的一部分），因此总体的时间复杂度是 O(n)。

- 这种方法在处理大规模数据时非常高效，因为它避免了排序操作，直接利用哈希表的查找优势来解决问题

