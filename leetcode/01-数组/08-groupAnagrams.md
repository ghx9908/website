---
title: 8. 字母异位词分组 - 49
last_update:
  date: 02/08/2023
  author: 高红翔
---

给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。

**字母异位词** 是由重新排列源单词的所有字母得到的一个新单词。

 

**示例 1:**

```
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

**示例 2:**

```
输入: strs = [""]
输出: [[""]]
```

**示例 3:**

```
输入: strs = ["a"]
输出: [["a"]]
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/group-anagrams/description/

## 🧠 解题思路



### 哈希
```js
var groupAnagrams = function (strs) {
  const map = new Map()
  for (let str of strs) {
    const sortStr = str.split("").sort().join("")
    if (!map.has(sortStr)) {
      map.set(sortStr, [])
    }s
    map.get(sortStr).push(str)
  }

  return Array.from(map.values())
}
```

1. 用字符串线切割再排序作为map的Key 

```js
  const sortStr = str.split("").sort().join("")
```
