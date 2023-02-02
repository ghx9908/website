---
title: 2. diff算法
last_update:
  date: 12/20/2022
  author: 高红翔
---

## React 中为什么要给组件设置 Key?

在开发过程中，我们需要保证某个元素的 key 在同级元素中具有唯一性

在 React Diff 算法中 React 会借助元素的 key 值来判断该元素是新创建的还是被移动而来的元素，从而减少不必要的元素重新渲染

此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系
