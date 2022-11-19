---
title: 斐波那契数-509
description: 动态规划 递归
last_update:
  date: 11/19/2022
  author: 高红翔
---

**斐波那契数** （通常用 `F(n)` 表示）形成的序列称为 **斐波那契数列** 。该数列由 `0` 和 `1` 开始，后面的每一项数字都是前面两项数字的和。也就是：

```
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
```

给定 `n` ，请计算 `F(n)` 。

**示例 1：**

```
输入：n = 2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
```

**示例 2：**

```
输入：n = 3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```

**示例 3：**

```
输入：n = 4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/fibonacci-number/description/

## 答案

### 递归

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n === 0) return 0
  if (n === 1) return 1
  return fib(n - 1) + fib(n - 2)
}
```

### 动态规划

**动规五部曲：**

这里我们要用一个一维 dp 数组来保存递归的结果

1. 确定 dp 数组以及下标的含义

dp[i]的定义为：第 i 个数的斐波那契数值是 dp[i]

2. 确定递推公式

为什么这是一道非常简单的入门题目呢？

**因为题目已经把递推公式直接给我们了：状态转移方程 dp[i] = dp[i - 1] + dp[i - 2];**

3. dp 数组如何初始化

**题目中把如何初始化也直接给我们了，如下：**

```js
dp[0] = 0
dp[1] = 1
```

4. 确定遍历顺序

从递归公式 dp[i] = dp[i - 1] + dp[i - 2];中可以看出，dp[i]是依赖 dp[i - 1] 和 dp[i - 2]，那么遍历的顺序一定是从前到后遍历的

5. 举例推导 dp 数组

按照这个递推公式 dp[i] = dp[i - 1] + dp[i - 2]，我们来推导一下，当 N 为 10 的时候，dp 数组应该是如下的数列：

0 1 1 2 3 5 8 13 21 34 55

```js
var fib = function (n) {
  let dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  console.log(dp)
  return dp[n]
}
```

- 时间复杂度：O(n)
- 空间复杂度：O(n)

### 优化

```js
var fib = function (n) {
  // 动规状态转移中，当前结果只依赖前两个元素的结果，所以只要两个变量代替dp数组记录状态过程。将空间复杂度降到O(1)
  let pre1 = 0
  let pre2 = 1
  let res
  if (n === 0) return 0
  if (n === 1) return 1
  for (let i = 2; i <= n; i++) {
    res = pre1 + pre2
    pre1 = pre2
    pre2 = res
  }
  return res
}
```
