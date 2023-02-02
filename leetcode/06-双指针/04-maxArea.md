---
title: 4. 盛最多水的容器--11
description: 考察双指针
last_update:
  date: 12/22/2022
  author: 高红翔
---

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：**你不能倾斜容器。

**示例 1：**

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/container-with-most-water/

## 解题思路：

矩阵的面积与两个因素有关：

1. 矩阵的长度：两条垂直线的距离
2. 矩阵的宽度：两条垂直线其中较短一条的长度

因此，要矩阵面积最大化，**两条垂直线的距离越远越好，两条垂直线的最短长度也要越长越好**。

我们设置两个指针 `left` 和 `right`，分别指向数组的最左端和最右端。此时，两条垂直线的距离是最远的，若要下一个矩阵面积比当前面积来得大，必须要把 `height[left] 和 height[right] `中较短的垂直线往中间移动，看看是否可以找到更长的垂直线。

## 解题

### 用两个 for 循环，计算每一种组合的长度并记录最大值:

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxArea = function (height) {
  max = 0
  for (let i = 0; i < height.length; i++) {
    for (j = i + 1; j < height.length; j++) {
      max = Math.max(max, (j - i) * Math.min(height[i], height[j]))
    }
  }
  return max
}
```

### 双指针法

```js
var maxArea = function (height) {
  let left = 0,
    right = height.length - 1,
    max = 0
  while (left < right) {
    let tmp = (right - left) * Math.min(height[left], height[right])
    if (tmp > max) {
      max = tmp
    }
    if (height[left] <= height[right]) {
      left++
    } else {
      right--
    }
  }
  return max
}
```
