---
title: 使用最小花费爬楼梯-746
description: 动态规划
last_update:
  date: 11/19/2022
  author: 高红翔
---

给你一个整数数组 `cost` ，其中 `cost[i]` 是从楼梯第 `i` 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。

你可以选择从下标为 `0` 或下标为 `1` 的台阶开始爬楼梯。

请你计算并返回达到楼梯顶部的最低花费。

**示例 1：**

```
输入：cost = [10,15,20]
输出：15
解释：你将从下标为 1 的台阶开始。
- 支付 15 ，向上爬两个台阶，到达楼梯顶部。
总花费为 15 。
```

**示例 2：**

```
输入：cost = [1,100,1,1,1,100,1,1,100,1]
输出：6
解释：你将从下标为 0 的台阶开始。
- 支付 1 ，向上爬两个台阶，到达下标为 2 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 4 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 6 的台阶。
- 支付 1 ，向上爬一个台阶，到达下标为 7 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 9 的台阶。
- 支付 1 ，向上爬一个台阶，到达楼梯顶部。
总花费为 6 。
```

**提示：**

- `2 <= cost.length <= 1000`
- `0 <= cost[i] <= 999`

  来源：力扣（LeetCode）
  链接：https://leetcode.cn/problems/min-cost-climbing-stairs/description/

## 思路

1. **确定 dp 数组以及下标的含义**

使用动态规划，就要有一个数组来记录状态

**dp[i]的定义：到达第 i 台阶所花费的最少体力为 dp[i]**。

2. 确定递推公式

**可以有两个途径得到 dp[i]，一个是 dp[i-1] 一个是 dp[i-2]**。

dp[i - 1] 跳到 dp[i] 需要花费 dp[i - 1] + cost[i - 1]。

dp[i - 2] 跳到 dp[i] 需要花费 dp[i - 2] + cost[i - 2]。

一定是选最小的，所以 dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);

3. dp 数组如何初始化

看一下递归公式，dp[i]由 dp[i - 1]，dp[i - 2]推出，既然初始化所有的 dp[i]是不可能的，那么只初始化 dp[0]和 dp[1]就够了，其他的最终都是 dp[0]dp[1]推出。

所以初始化 dp[0] = 0，dp[1] = 0;

4. 确定遍历顺序

因为是模拟台阶，而且 dp[i]由 dp[i-1]dp[i-2]推出，所以是从前到后遍历 cost 数组就可以了。

5. 举例推导 dp 数组

## 解题

```js
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function (cost) {
  const dp = [0, 0]

  for (let i = 2; i <= cost.length + 1; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
  }
  return dp[cost.length]
}
```
