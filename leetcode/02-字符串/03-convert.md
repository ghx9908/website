---
title: Z字形变换-6
description: 标识法
last_update:
  date: 12/22/2022
  author: 高红翔
---

将一个给定字符串 `s` 根据给定的行数 `numRows` ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 `"PAYPALISHIRING"` 行数为 `3` 时，排列如下：

```
P   A   H   N
A P L S I I G
Y   I   R
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如：`"PAHNAPLSIIGYIR"`。

请你实现这个将字符串进行指定行数变换的函数：

```
string convert(string s, int numRows);
```

**示例 1：**

```
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
```

**示例 2：**

```
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I    N
A   L S  I G
Y A   H R
P     I
```

**示例 3：**

```
输入：s = "A", numRows = 1
输出："A"
```

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/zigzag-conversion/description/

## 解题思路：

![](http://rn9uebj7s.hb-bkt.clouddn.com/FtfJkVggSLgWKQEmLqhZ0IFwo6In)

来源：https://leetcode.cn/problems/zigzag-conversion/solutions/21610/zzi-xing-bian-huan-by-jyd/

## 解题

```js
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
  let arr = new Array(numRows)
  if (numRows < 2) return s
  let flag = -1,
    i = 0
  for (const value of s) {
    if (arr[i] === undefined) {
      arr[i] = ""
    }
    arr[i] += value
    if (i === 0 || i === numRows - 1) {
      flag = -flag
    }
    i += flag
  }
  return arr.join("")
}
```
