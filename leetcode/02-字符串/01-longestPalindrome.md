---
title: 最长回文子串-5
description: 双指针 动态规划
last_update:
  date: 11/19/2022
  author: 高红翔
---

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

**示例 1：**

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

**示例 2：**

```
输入：s = "cbbd"
输出："bb"
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/longest-palindromic-substring/

## 解题

### 双指针

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let max = ""

  for (let i = 0; i < s.length; i++) {
    // 分奇偶， 一次遍历，每个字符位置都可能存在奇数或偶数回文
    helper(i, i)
    helper(i, i + 1)
  }

  function helper(l, r) {
    // 定义左右双指针
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--
      r++
    }
    // 拿到回文字符， 注意 上面while满足条件后多执行了一次，所以需要l+1, r+1-1
    const maxStr = s.slice(l + 1, r + 1 - 1)
    // 取最大长度的回文字符
    if (maxStr.length > max.length) max = maxStr
  }
  return max
}
```
