---
title: 单词搜索-79
description: 考察递归回溯
last_update:
  date: 11/16/2022
  author: 高红翔
---

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
输出：true
```

**示例 3：**

![img](https://assets.leetcode.com/uploads/2020/10/15/word3.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
输出：false
```

**提示：**

- `m == board.length`
- `n = board[i].length`
- `1 <= m, n <= 6`
- `1 <= word.length <= 15`
- `board` 和 `word` 仅由大小写英文字母组成

**进阶：**你可以使用搜索剪枝的技术来优化解决方案，使其在 `board` 更大的情况下可以更快解决问题？

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/assign-cookies

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
输出：true
```

**示例 3：**

![img](https://assets.leetcode.com/uploads/2020/10/15/word3.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
输出：false
```

**提示：**

- `m == board.length`
- `n = board[i].length`
- `1 <= m, n <= 6`
- `1 <= word.length <= 15`
- `board` 和 `word` 仅由大小写英文字母组成

**进阶：**你可以使用搜索剪枝的技术来优化解决方案，使其在 `board` 更大的情况下可以更快解决问题？

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/assign-cookies

## 思路

+ 以"SEE"为例，首先要选起点：遍历矩阵，找到起点S。
+ 起点可能不止一个，基于其中一个S，看看能否找出剩下的"EE"路径。
+ 下一个字符E有四个可选点：当前点的上、下、左、右。
+ 逐个尝试每一种选择。基于当前选择，为下一个字符选点，又有四种选择。
+ 每到一个点做的事情是一样的。DFS 往下选点，构建路径。
+ 当发现某个选择不对，不用继续选下去了，结束当前递归，考察别的选择。

![image](https://user-images.githubusercontent.com/16274157/202124544-8856bd57-d801-484c-99a7-ca6e778c53b7.png)

**递归把握什么？**

关注当前考察的点，处理它，其他丢给递归子调用去做。
+ 判断当前选择的点，本身是不是一个错的点。
  - ssss 
+ 剩下的字符能否找到路径，交给递归子调用去做。

如果当前点是错的，不用往下递归了，返回false。否则继续递归四个方向，为剩下的字符选点。 那么，哪些情况说明这是一个错的点：

+ 当前的点，越出矩阵边界。
+ 当前的点，之前访问过，不满足「同一个单元格内的字母不允许被重复使用」。
+ 当前的点，不是目标点，比如你想找 E，却来到了 D。

![image](https://user-images.githubusercontent.com/16274157/202131103-2c3d3fd8-4cdc-46ce-bf80-5b5f1d75029a.png)

**记录访问过的点**

用一个二维矩阵 used，记录已经访问过的点，下次再选择访问这个点，就直接返回 false。

**为什么要回溯?**

有的选点是错的，选它就构建不出目标路径，不能继续选。要撤销这个选择，去尝试别的选择。

```
// search 表示：基于当前选择的点[nextX, nextY]，能否找到剩余字符的路径。
for (let direction of directions) {
      let [x, y] = direction;
      let nextX = startX + x;
      let nextY = startY + y;

      // 需要保证未越界且未被访问过
      if (inArea(nextX, nextY) && !visited[nextY][nextX]) {
            if (search(nextX, nextY, wordIndex + 1)) {
                  return true;
            }
      }
}
```

如果第一个循环的递归调用返回 false，就会执行下一个循环的递归调用


+ 这里暗含回溯：当前处在[x,y]，选择[x+1,y]继续递归，返回false的话，会撤销[x+1,y]这个选择，回到[x,y]，继续选择[x-1,y]递归。

只要其中有一个递归调用返回 true，之后的递归就不会执行，即找到解就终止搜索，把枝剪了。

如果求出 search 为 false，说明基于当前点不能找到剩下的路径，所以当前递归要返回false，还要在visited矩阵中把当前点恢复为未访问，让它后续能正常被访问。

+ 因为，基于当前路径，选当前点是不对的，但基于别的路径，走到这选它，有可能是对的。

**什么时候返回 true？**

在递归中，我们设置了所有返回 false 的情况。

当指针越界，此时已经考察完单词字符，意味着，在该递归分支中，为一个个字符选点，始终没有返回过 false，这些字符都选到对的点。所以指针越界就可以返回 true。


## 参考答案
```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */

// 搜索的方向
let directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]; // 左 右 上 下

let visited;
let exist = function (board, word) {
  // 从左上角开始，可以理解指标坐标系，横向X是列数；纵向Y是行数
  let maxY = board.length;
  if (!maxY) return false;
  let maxX = board[0].length;

  // 二维数组记录已访问过的元素
  visited = new Array(maxY);
  for (let y = 0; y < visited.length; y++) {
    visited[y] = new Array(maxX).fill(false);
  }

  // 边界判断
  let inArea = (x, y) => {
    return x >= 0 && x < maxX && y >= 0 && y < maxY;
  };

  let search = (startX, startY, wordIndex) => {
    // 当前单元格的字符
    let curCell = board[startY][startX];
    // 当前模板字符的第x个字符
    let curChar = word[wordIndex];
    // 当前起始字符不匹配，直接失败
    if (curCell !== curChar) {
      return false;
    }

    // 下面的都是当前字符匹配成功，需要递归四个方向
    // 如果递归到最后一位字符，就直接返回最后一位字符是否匹配成功
    if (wordIndex === word.length - 1) {
      // 直接返回true，不用再递归
      return curChar === curChar;
    }

    // 如果找到目标字符，进一步递归，先记录为已访问元素，防止递归的时候重复访问
    visited[startY][startX] = true;

    for (let direction of directions) {
      let [x, y] = direction;
      let nextX = startX + x;
      let nextY = startY + y;

      // 需要保证未越界且未被访问过
      if (inArea(nextX, nextY) && !visited[nextY][nextX]) {
        // 如果找到目标字符就退出该方向的循环，不需要继续再执行其他方向的递归
        if (search(nextX, nextY, wordIndex + 1)) {
          return true;
        }
      }
    }
    // 重置已访问标记位
    visited[startY][startX] = false;
  };

  // 第一个字符不知道在哪个位置
  // 循环先找到第一个相等的字符，然后再递归
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (search(x, y, 0)) {
        // 找到直接跳出双层循环
        return true;
      }
    }
  }

  return false;
};
```
