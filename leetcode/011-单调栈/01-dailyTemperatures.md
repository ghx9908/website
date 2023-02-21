---
title: 1、每日温度-739
last_update:
  date: 02/21/203
  author: 高红翔
---

给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

**示例 1:**

```
输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]
```

**示例 2:**

```
输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]
```

**示例 3:**

```
输入: temperatures = [30,60,90]
输出: [1,1,0]
```

**提示：**

- `1 <= temperatures.length <= 105`
- `30 <= temperatures[i] <= 100`

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/daily-temperatures/description/

## 思路

https://programmercarl.com/0739.%E6%AF%8F%E6%97%A5%E6%B8%A9%E5%BA%A6.html#%E6%80%9D%E8%B7%AF

```js
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
  let n = temperatures.length
  const res = Array(n).fill(0)
  const stack = []
  for (let i = 0; i < n; i++) {
    console.log(temperatures[stack[stack.length - 1]])
    while (stack && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      let temp = stack.pop()
      res[temp] = i - temp
    }

    stack.push(i)
  }
  return res
}
```
