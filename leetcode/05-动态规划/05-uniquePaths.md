---
title: 不同路径-62
description: 动态规划
last_update:
  date: 11/19/2022
  author: 高红翔
---

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

**示例 1：**

![img](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

```
输入：m = 3, n = 7
输出：28
```

**示例 2：**

```
输入：m = 3, n = 2
输出：3
解释：
从左上角开始，总共有 3 条路径可以到达右下角。
1. 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右
3. 向下 -> 向右 -> 向下
```

**示例 3：**

```
输入：m = 7, n = 3
输出：28
```

**示例 4：**

```
输入：m = 3, n = 3
输出：6
```

**提示：**

- `1 <= m, n <= 100`
- 题目数据保证答案小于等于 `2 * 109`

  来源：力扣（LeetCode）
  链接：https://leetcode.cn/problems/unique-paths/description/

## 思路

机器人从(0 , 0) 位置出发，到(m - 1, n - 1)终点。

按照动规五部曲来分析：

1. 确定 dp 数组（dp table）以及下标的含义

dp[i] [j] ：表示从（0 ，0）出发，到(i, j) 有 dp[i][j]条不同的路径。

2. 确定递推公式

想要求 dp[i] [j]，只能有两个方向来推导出来，即 dp[i - 1] [j] 和 dp[i] [j - 1]。

那么很自然，dp[i] [j] = dp[i - 1] [j] + dp[i] [j - 1]，因为 dp[i] [j]只有这两个方向过来。

3. dp 数组的初始化

如何初始化呢，首先 dp[i] [0]一定都是 1，因为从(0, 0)的位置到(i, 0)的路径只有一条，那么 dp[0] [j]也同理。

所以初始化代码为：

```js
for (let i = 0; i < m; i++) dp[i][0] = 1
for (let j = 0; j < n; j++) dp[0][j] = 1
```

4. 确定遍历顺序

这里要看一下递推公式 dp[i] [j] = dp[i - 1] [j] + dp[i] [j - 1]，dp[i] [j]都是从其上方和左方推导而来，那么从左到右一层一层遍历就可以了。

5. 举例推导 dp 数组

## 解题

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  let dp = new Array(m + 1).fill().map((item) => Array(n + 1))
  for (let j = 0; j <= n; j++) {
    dp[0][j] = 0
    dp[1][j] = 1
  }
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 0
    dp[i][1] = 1
  }
  for (let i = 2; i <= m; i++) {
    for (let j = 2; j <= n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }

  return dp[m][n]
}
```
