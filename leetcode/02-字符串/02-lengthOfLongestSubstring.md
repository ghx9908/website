---
title: 无重复字符的最长子串-3
description: 双指针 滑动窗口
last_update:
  date: 12/22/2022
  author: 高红翔
---

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/

## 解题

### 滑动窗口

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const set = new Set() //判断滑动窗口内是否有重复元素
  let i = 0, //滑动窗口右边界
    j = 0, //滑动窗口左边界
    maxLength = 0
  if (s.length === 0) {
    //极端情况
    return 0
  }
  for (i; i < s.length; i++) {
    if (!set.has(s[i])) {
      //当前元素不在set中 就加入set 然后更新最大长度，i++继续下一轮循环
      set.add(s[i])
      maxLength = Math.max(maxLength, set.size)
    } else {
      //set中有重复元素不断让j++ 并删除窗口之外的元素 直到滑动窗口内没有重复的元素
      while (set.has(s[i])) {
        set.delete(s[j])
        j++
      }
      set.add(s[i]) //放心将s[i]加入set中
    }
  }
  return maxLength
}
```

---

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (s.length <= 1) return s.length
  let hash = new Set()
  let j = 0,
    maxValue = 0
  for (let i = 0; i < s.length; i++) {
    while (hash.has(s[i])) {
      hash.delete(s[j])
      j++
    }
    hash.add(s[i])

    maxValue = Math.max(maxValue, hash.size)
  }
  return maxValue
}
```
