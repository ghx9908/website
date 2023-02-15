---
title: 2.JavaScript 数组结构与树结构的转换
last_update:
  date: 12/21/2022
  author: 高红翔
---

## Array 结构 转 Tree 结构

```js
/** 数组结构数据 */
const arrayData = [
  { id: 2, title: "中国", parent_id: 0 },
  { id: 3, title: "广东省", parent_id: 2 },
  { id: 4, title: "广州市", parent_id: 3 },
  { id: 5, title: "天河区", parent_id: 4 },
  { id: 6, title: "湖南省", parent_id: 2 },
  { id: 1, title: "俄罗斯", parent_id: 0 },
]
```

### 使用递归的方法

1. 递归需分为两个函数来完成
2. 以为返回的递归函数主要处理查找 id 添加 children
3. 由转化函数将结果返回

```js
/**
 * 递归查找添加children
 * @param {数组数据} data
 * @param {存放返回结果} result
 * @param {父id} pid
 */
function getChildren(data, result, pid) {
  for (const item of data) {
    if (item.parent_id === pid) {
      const newItem = { children: [], ...item }
      result.push(newItem)
      getChildren(data, newItem.children, item.id)
    }
  }
}

/**
 * 转化方法
 * @param {数组数据} data
 * @param {父id} pid
 * @returns
 */
function arrayToTree(data, pid) {
  let result = []
  getChildren(data, result, pid)
  return result
}

console.log(arrayToTree(arrayData, 0))
```

### 使用循环的方法

1. 使用数组的 reduce 方法将，data 数组转为对象保存在对象变量 obj 中，每一项的 id 作为对象的 key;
2. 遍历 data 数组，判断 parent_id === 0 的为第一层数组对象，push 到 result 数组，
3. 继续遍历，找爹现场，在 2 中我们找到数组的第一层将作为其他层级的父层，
   例如： 我们在第一轮的时候 const parent = obj[item.parent_id] 这个 parent 对象对应的就是 parent_id === 0 的 title = 中国或者俄罗斯节点,依此类推在这个 parent 对象里不断添加 children 属性，直到他没有 parent_id 与自己 id 一样的 children

```js
/**
 * 数组结构转为树结构
 * @param {*} data 数组数据
 * @returns
 */
function arrayToTree(data) {
  const result = []
  const obj = data.reduce((pre, cur) => {
    pre[cur.id] = cur
    return pre
  }, {})
  for (let item of data) {
    if (item.parent_id === 0) {
      result.push(item)
      continue
    }
    if (item.parent_id in obj) {
      const parent = obj[item.parent_id]
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return result
}
console.log(arrayToTree(arrayData, 0))
```

## Tree 结构 转 Array 结构

```js
/** 树状形结构数据treeData */
const treeData = [
  {
    id: 2,
    title: "中国",
    parent_id: 0,
    children: [
      {
        id: 3,
        title: "广东省",
        parent_id: 2,
        children: [
          {
            id: 4,
            title: "广州市",
            parent_id: 3,
            children: [{ id: 5, title: "天河区", parent_id: 4 }],
          },
        ],
      },
      { id: 6, title: "湖南省", parent_id: 2 },
    ],
  },
  { id: 1, title: "俄罗斯", parent_id: 0 },
]
```

### 使用递归的方法

1.  使用数组的 reduce 方法， 解构数组的每一项，如果有 children,就用 concat 一层一层的抽取出来，使得每个对象项都包裹在一个[]下

```js
/**
 * 树结构数组扁平化
 * @param {*} data 树结构的数组
 * @returns
 */
function treeToArray(data) {
  return data.reduce((pre, cur) => {
    const { children = [], ...item } = cur
    return pre.concat([{ ...item }], treeToArray(children))
  }, [])
}
```

### 迭代遍历（利用栈思想）

1.  二叉树的前中后序的迭代遍历
2.  二叉树的层序遍历

```js
/**
 * 树结构数组扁平化
 * @param {*} data 树结构的数组
 * @returns
 */
function treeToArray(arr) {
  const result = []
  const stack = [...arr]
  while (stack.length) {
    const cur = stack.pop()
    const { children = [], ...items } = cur
    result.push(items)
    if (children.length > 0) stack.push(...children)
  }
  return result
}
console.log(treeToArray(treeData))
```

## Tree 结构根据 ID 找路径

使用目录的时候会有这样的需求，根据 id 查找所在目录路径，也是递归实现。

1. 遍历树结构数组，判断 id 是否为当前项的 id,是就返回当前目录名词
2. 判断当前项是否有 children 依此递归。

```js
/**
 * 根据id查找所在目录路径
 * @param {树结构的数组数据} tree
 * @param {要查找的id} id
 * @param {初始路径} path
 * @returns
 */
function parseTreePath(tree, id, path = "") {
  for (let i = 0; i < tree.length; i++) {
    let tempPath = path
    // 避免出现在最前面的/
    tempPath = `${tempPath ? tempPath + "/ " : tempPath}${tree[i].title}`
    if (tree[i].id == id) return tempPath
    else if (tree[i].children) {
      let reuslt = parseTreePath(tree[i].children, id, tempPath)
      if (reuslt) return reuslt
    }
  }
}

function parseTreePath(tree, id, path = "") {
  let path = [] //用来存放符合条件结果
  // startIndex 开始搜索的位置
  const combineHelper = (n, k, startIndex) => {
    if (path.length === k) {
      //回溯函数终止条件
      result.push([...path])
      return
    }
    //优化剪支 当剩下的子叶小于需要需要的子叶时候停止
    for (let i = startIndex; i <= n - (k - path.length) + 1; ++i) {
      path.push(i) //处理节点
      combineHelper(n, k, i + 1) //递归
      path.pop() //回溯，撤销处理的节点
    }
  }
  combineHelper(n, k, 1)
  return result
}

console.log(parseTreePath(treeData, 5))
```
