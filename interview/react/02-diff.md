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

### **请说说 react 的 diff 算法**

React 的 diff 算法是 React 在更新 DOM 时使用的算法。它的目的是最小化页面的重新渲染，以便提高性能。

当 React 渲染组件时，它会在内存中生成虚拟 DOM 树。然后，它会对比新的虚拟 DOM 树和之前的树的差异，找出最小的变化集合。这些变化会被打包成一组操作，用来更新真正的 DOM。

React 的 diff 算法遵循以下规则：

- 同级比较：React 会把新的虚拟 DOM 树中的每一个节点与之前的树中的节点进行比较。如果节点类型不同或者属性不同，React 会直接替换掉原来的节点。如果节点类型相同，React 会继续递归比较这两个节点的子节点。

- 先序深度优先搜索：React 会按照节点的先序深度优先搜索的顺序，对比新旧两棵虚拟 DOM 树。这意味着，如果节点 A 在虚拟 DOM 中出现在节点 B 之前，那么在比较过程中，A 也会先于 B 被比较。

- 同层比较：在比较同级节点时，React 会把新的虚拟 DOM 树中的节点与之前的树中的节点进行比较。如果两个节点的类型不同或者属性不同，React 会直接替换掉原来的节点。如果节点类型相同，React 会继续递归比较这两个节点的子节点。

  在比较同级节点时，React 会尽可能多地保留原来的节点。如果新的虚拟 DOM 中有多余的节点，它会把多余的节点插入到相应的位置；如果新的虚拟 DOM 中少了某些节点，它会把多余的节点删除。

  在比较过程中，React 会把节点分成四类：新增、删除、修改、移动。对于新增、删除、修改的节点，React 会直接在 DOM 中进行对应的操作。对于移动的节点，React 会先将节点从原来的位置删除，然后再将节点插入到新的位置。

  通过这样的方式，React 的 diff 算法可以最小化页面的重新渲染，提高性能。