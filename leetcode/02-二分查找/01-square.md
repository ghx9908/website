---
title: x 的平方根 - 69
description: 考察二分查找
last_update:
  date: 11/17/2022
  author: pengfei.zuo
---

## 题目

实现 `int sqrt(int x)` 函数。

计算并返回 `x` 的平方根，其中 `x` 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

示例 1:

```
输入: 4
输出: 2
```

```
输入: 8
输出: 2
```

说明: `8` 的平方根是 `2.82842...`,

由于返回类型是整数，小数部分将被舍去。

来源：力扣（LeetCode）

链接：https://leetcode.cn/problems/sqrtx/description/

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 思路

本题利用二分查找来求解，一开始把右边界粗略的设定为目标值 `x`，左右边界的中间值设为 `middle`，然后在二分过程中每次发现 `middle * middle` < `x` 的情况，就把这个 `middle` 值记录为`ans`。

如果计算出的乘积正好等于 `x`，就直接返回这个`mid` 值。

如果二分查找超出边界了，无论最后的边界是停留在小于 `x` 的位置还是大于 `x` 的位置，都返回 `ans` 即可，因为它是最后一个乘积小于 `x` 的值，一定是正确答案。

## 答案

```js
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x === 1) return x;
  var left = 0;
  var right = x;
  var ans = -1;
  while (left <= right) {
    var middle = Math.floor(left + (right - left) / 2);
    var pow = middle * middle;

    if (pow === x) {
      return middle;
    }

    if (pow < x) {
      ans = middle;
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  return ans;
};

```
