---
title: 爬楼梯-70
description: 动态规划 递归
last_update:
  date: 11/19/2022
  author: 高红翔
---

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**示例 1：**

```
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
```

**示例 2：**

```
输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

**提示：**

- `1 <= n <= 45`

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/climbing-stairs/description/

## 思路

爬到第一层楼梯有一种方法，爬到二层楼梯有两种方法。

那么第一层楼梯再跨两步就到第三层 ，第二层楼梯再跨一步就到第三层。

所以到第三层楼梯的状态可以由第二层楼梯 和 到第一层楼梯状态推导出来，那么就可以想到动态规划了。

**我们来分析一下，动规五部曲：**

定义一个一维数组来记录不同楼层的状态

1. 确定 dp 数组以及下标的含义

​ p[i]： 爬到第 i 层楼梯，有 dp[i]种方法

2. 确定递推公式

   dp[i] = dp[i - 1] + dp[i - 2] 。

3. dp 数组如何初始化

​ dp[1] = 1，dp[2] = 2

4. 确定遍历顺序

​ 从递推公式 dp[i] = dp[i - 1] + dp[i - 2];中可以看出，遍历顺序一定是从前向后遍历的

5. 举例推导 dp 数组

​ 举例当 n 为 5 的时候，dp table（dp 数组）应该是这样的 1,2,3,5,8

## 答案

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  let db = [0, 1, 2]
  for (let i = 3; i <= n; i++) {
    db[i] = db[i - 1] + db[i - 2]
  }
  return db[n]
}
```

- 时间复杂度：O(n)
- 空间复杂度：O(n)

### 爬 m 阶

```ts
function climbStairs(n: number): number {
  /**
        一次可以爬m阶
        dp[i]: i阶楼梯的方法种数
        dp[1]: 1;
        dp[2]: 2;
        dp[3]: dp[2] + dp[1];
        ...
        dp[i]: dp[i - 1] + dp[i - 2] + ... + dp[max(i - m, 1)]; 从i-1加到max(i-m, 1)
     */
  const m: number = 2 // 本题m为2
  const dp: number[] = new Array(n + 1).fill(0)
  dp[1] = 1
  dp[2] = 2
  for (let i = 3; i <= n; i++) {
    const end: number = Math.max(i - m, 1)
    for (let j = i - 1; j >= end; j--) {
      dp[i] += dp[j]
    }
  }
  return dp[n]
}
```
