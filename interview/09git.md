---
sidebar_position: 12
title: git
---

## merge 和 rebase 有什么区别

### 一句话总结：

> `git merge` 是把两个分支的提交“**合并在一起，保留分叉历史**”；
> `git rebase` 是“**把你当前分支的提交挪到目标分支之后，重写历史**”。

### 一、基本命令对比

```bash
# 合并目标分支到当前分支
git merge main

# 把当前分支的提交“平移”到 main 分支之后
git rebase main
```

### 二、合并后的提交历史对比

`merge` 会生成一个新的合并提交：

特征：

- 有一条“叉出去又合回来”的分支线
- 提交历史保留了真实开发过程
- 容易看出是谁从哪合了啥

`rebase` 会把分支历史“平铺”，好像从未分叉：

```text
A---B---C main
             \
              D'---E' feature（rebase 后的新提交）

```

特征：

- 变成一条“直线”，没有 merge commit
- 原来的 `D`、`E` 会变成新的提交对象（`D'`、`E'`）

### 三、它们在干什么？（更底层视角）

| 操作     | 本质                                                              |
| -------- | ----------------------------------------------------------------- |
| `merge`  | 创建一个 **新的合并提交**，连接两个分支                           |
| `rebase` | 把当前分支的每个提交 **摘下来，重放到目标分支的最后一个提交之后** |

### 四、rebase 比较几次呢

```text
         G---H   ← feature
        /
A---B---C---D---E   ← main
```

你执行：

```bash

git checkout feature
git rebase main
```

> 这时候 Git 会执行 **三个步骤**：

#### ✅ 第 1 步：找共同祖先

```text
merge-base(feature, main) = C
```

#### ✅ 第 2 步：对比差异（生成 patch）

- G：其实是 `diff(C, G)`
- H：其实是 `diff(G, H)`

🔧 Git 会记录 G 和 C 之间的差异（也就是 G 这次提交干了什么事），然后把这个 patch 应用到 E 后面，生成 G'。

接着再拿 `diff(G, H)` 的差异补丁，应用在 G' 上，生成 H'。

---

### ✅ 第 3 步：重演提交（生成新 commit）

```text

             G'---H'    ← feature（rebase 后）
            /
A---B---C---D---E       ← main
```

- `G'` 是：把 `G - C` 的变更应用到 `E` 上
- `H'` 是：把 `H - G` 的变更应用到 `G'` 上
