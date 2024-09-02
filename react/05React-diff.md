---
title: react的diff算法
last_update:
  date: 02/20/2023
  author: 高红翔
---

React 的 diff 算法是 React 在更新 DOM 时使用的算法。它的目的是最小化页面的重新渲染，以便提高性能。

当 React 渲染组件时，它会在内存中生成虚拟 DOM 树。然后，它会对比新的虚拟 DOM 树和之前的树的差异，找出最小的变化集合。这些变化会被打包成一组操作，用来更新真正的 DOM。

React 的 diff 算法遵循以下规则：

- 同级比较：React 会把新的虚拟 DOM 树中的每一个节点与之前的树中的节点进行比较。如果节点类型不同或者属性不同，React 会直接替换掉原来的节点。如果节点类型相同，React 会继续递归比较这两个节点的子节点。

- 先序深度优先搜索：React 会按照节点的先序深度优先搜索的顺序，对比新旧两棵虚拟 DOM 树。这意味着，如果节点 A 在虚拟 DOM 中出现在节点 B 之前，那么在比较过程中，A 也会先于 B 被比较。

  在比较同级节点时，React 会尽可能多地保留原来的节点。如果新的虚拟 DOM 中有多余的节点，它会把多余的节点插入到相应的位置；如果新的虚拟 DOM 中少了某些节点，它会把多余的节点删除。

  在比较过程中，React 会把节点分成四类：新增、删除、修改、移动。对于新增、删除、修改的节点，React 会直接在 DOM 中进行对应的操作。对于移动的节点，React 会先将节点从原来的位置删除，然后再将节点插入到新的位置。

  通过这样的方式，React 的 diff 算法可以最小化页面的重新渲染，提高性能。

## 单节点的 diff

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230220164823.png)

```jsx
function FunctionComponent() {
  const [number, setNumber] = React.useState(0)
  return number === 0 ? (
    <div onClick={() => setNumber(number + 1)} key="title1" id="title">
      title
    </div>
  ) : (
    <div onClick={() => setNumber(number + 1)} key="title2" id="title2">
      title2
    </div>
  )
}
```

### 实现

```js
/**
 *
 * @param {*} returnFiber 父fiber
 * @param {*} currentFirstChild 老fiber
 * @param {*} element 新的虚拟DOM对象 为跟节点
 * @returns 返回新的第一个子fiber
 */
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  //新的虚拟DOM的key,也就是唯一标准
  const key = element.key // null
  let child = currentFirstChild //老fiber

  while (child !== null) {
    //有老fiber
    //判断此老fiber对应的key和新的虚拟DOM对象的key是否一样 null===null
    if (child.key === key) {
      //判断老fiber对应的类型和新虚拟DOM元素对应的类型是否相同
      if (child.type === element.type) {
        // p div
        deleteRemainingChildren(returnFiber, child.sibling)
        //如果key一样，类型也一样，则认为此节点可以复用
        const existing = useFiber(child, element.props)
        existing.return = returnFiber
        return existing
      } else {
        //如果找到一key一样老fiber,但是类型不一样，不能此老fiber,把剩下的全部删除
        deleteRemainingChildren(returnFiber, child)
      }
    } else {
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  //因为我们现实的初次挂载，老节点currentFirstChild肯定是没有的，所以可以直接根据虚拟DOM创建新的Fiber节点
  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}
```

## 多节点的 diff

### 简单比较

- DOM DIFF 的三个规则
  - 只对同级元素进行比较，不同层级不对比
  - 不同的类型对应不同的元素
  - 可以通过 key 来标识同一个节点
- 第 1 轮遍历
  - 如果 key 不同则直接结束本轮循环
  - newChildren 或 oldFiber 遍历完，结束本轮循环
  - key 相同而 type 不同，标记老的 oldFiber 为删除，创建新的 fiber 节点， 继续循环
  - key 相同而 type 也相同，则可以复用老节 oldFiber 节点，继续循环
- 第 2 轮遍历
  - newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
  - oldFiber 遍历完了，而 newChildren 还有，将剩下的 newChildren 标记为插入，DIFF 结束
  - newChildren 和 oldFiber 都同时遍历完成，diff 结束
  - newChildren 和 oldFiber 都没有完成，则进行`节点移动`的逻辑
- 第 3 轮遍历
  - 处理节点移动的情况

### 处理移动

- 多个节点数量不同、key 不同
- 第一轮比较 A 和 A，相同可以复用，更新，然后比较 B 和 C，key 不同直接跳出第一个循环
- 把剩下 oldFiber 的放入 existingChildren 这个 map 中
- 然后声明一个`lastPlacedIndex`变量，表示不需要移动的老节点的索引
- 继续循环剩下的虚拟 DOM 节点
- 如果能在 map 中找到相同 key 相同 type 的节点则可以复用老 fiber,并把此老 fiber 从 map 中删除
- 如果能在 map 中找不到相同 key 相同 type 的节点则创建新的 fiber
- 如果是复用老的 fiber,则判断老 fiber 的索引是否小于 lastPlacedIndex，如果是要移动老 fiber，不变
- 如果是复用老的 fiber,则判断老 fiber 的索引是否小于 lastPlacedIndex，如果否则更新 lastPlacedIndex 为老 fiber 的 index
- 把所有的 map 中剩下的 fiber 全部标记为删除
- (删除#li#F)=>(添加#li#B)=>(添加#li#G)=>(添加#li#D)=>null

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230220164329.png)

```js
function FunctionComponent() {
  const [number, setNumber] = React.useState(0)
  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="b">
        B
      </li>
      <li key="C">C</li>
      <li key="D">D</li>
      <li key="E">E</li>
      <li key="F" id="F">
        F
      </li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A2</li>
      <li key="C">C2</li>
      <li key="E">E2</li>
      <li key="B" id="b2">
        B2
      </li>
      <li key="G">G</li>
      <li key="D">D2</li>
    </ul>
  )
}
```

### 实现

```js
/**
 *  核心的 diff 算法 多节点 创建子fiber链表并返回第一个子fiber
 * @param {*} returnFiber 需要新biber对应父biber
 * @param {*} currentFirstChild 老fiber对应的子fiber
 * @param {*} newChildren 虚拟dom [hello文本节点,span虚拟DOM元素]
 * @returns 返回第一个子fiber
 */
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  let resultingFirstChild = null //返回的第一个新儿子
  let previousNewFiber = null //上一个的一个新的儿fiber
  let newIdx = 0 //用来遍历新的虚拟DOM的索引
  let oldFiber = currentFirstChild //第一个老fiber
  let nextOldFiber = null //下一个第fiber
  let lastPlacedIndex = 0 //上一个不需要移动的老节点的索引
  // 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值
  //遍历新的虚拟 dom，和老的 fiber 进行比较 看是否能复用
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    //先暂下一个老fiber
    nextOldFiber = oldFiber.sibling
    //尽可能复用有 fiber，服用不了创建新的 fiber, 试图更新或者试图复用老的fiber 看 key 和 type 一样不一样
    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx])
    if (newFiber === null) {
      break
    }
    if (shouldTrackSideEffects) {
      //如果有老fiber,但是新的fiber并没有成功复用老fiber和老的真实DOM，那就删除老fiber,在提交阶段会删除真实DOM
      // 未复用的节点没有alternate
      if (oldFiber && newFiber.alternate === null) {
        // 给父fiber和flags添加删除标识和 deletions添加要删除的子节点
        deleteChild(returnFiber, oldFiber)
      }
    }
    //指定新fiber的位置
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber //li(A).sibling=p(B).sibling=>li(C)
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
    oldFiber = nextOldFiber
  }
  //新的虚拟DOM已经循环完毕，3=>2
  if (newIdx === newChildren.length) {
    //删除剩下的老fiber
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }
  if (oldFiber === null) {
    //如果老的 fiber已经没有了， 新的虚拟DOM还有，进入插入新节点的逻辑
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx])
      if (newFiber === null) continue
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      //如果previousNewFiber为null，说明这是第一个fiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber //这个newFiber就是大儿子
      } else {
        //否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber
      }
      //让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber
    }
  }
  // 开始处理移动的情况
  // 把老节点的 fiber 和 key 或者 index 做映射 放到 map 中
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)
  //开始遍历剩下的虚拟DOM子节点
  for (; newIdx < newChildren.length; newIdx++) {
    // 在 map 中 查找该虚拟 dom节点是否有可用的 fiber 能复用，不能就新建 fiber 并返回
    const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx])
    if (newFiber !== null) {
      if (shouldTrackSideEffects) {
        //如果要跟踪副作用，并且有老fiber
        // 如果在 map 中找到 说明复用成功，则map 中删除复用的该 fiber
        if (newFiber.alternate !== null) {
          existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
        }
      }
      //指定新的fiber存放位置 ，并且给lastPlacedIndex赋值
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber //这个newFiber就是大儿子
      } else {
        //否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber
      }
      //让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber
    }
  }
  if (shouldTrackSideEffects) {
    //等全部处理完后，删除map中所有剩下的老fiber
    existingChildren.forEach((child) => deleteChild(returnFiber, child))
  }
  return resultingFirstChild
}
```

辅助方法

```js
//---------------
// 试图更新或者试图复用老的fiber
function updateSlot(returnFiber, oldFiber, newChild) {
  const key = oldFiber !== null ? oldFiber.key : null
  if (newChild !== null && typeof newChild === "object") {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        //如果key一样，进入更新元素的逻辑
        if (newChild.key === key) {
          return updateElement(returnFiber, oldFiber, newChild)
        }
      }
      default:
        return null
    }
  }
  return null
}

// 复用或者新建 fiber
function updateElement(returnFiber, current, element) {
  const elementType = element.type
  if (current !== null) {
    //判断是否类型一样，则表示key和type都一样，可以复用老的fiber和真实DOM
    if (current.type === elementType) {
      const existing = useFiber(current, element.props)
      existing.return = returnFiber
      return existing
    }
  }
  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}

/**
 *给父fiber的deletions和flags赋值
 * @param {*} returnFiber 父fiber
 * @param {*} childToDelete 将要删除的老节点
 * @returns
 */
function deleteChild(returnFiber, childToDelete) {
  if (!shouldTrackSideEffects) return
  const deletions = returnFiber.deletions
  if (deletions === null) {
    returnFiber.deletions = [childToDelete]
    returnFiber.flags |= ChildDeletion
  } else {
    returnFiber.deletions.push(childToDelete)
  }
}

/**
 *  指定新的fiber在新的挂载索引 别切根据是否有副作用设置fiber的flags  newFiber.index = newIdx newFiber.flags |= Placement
 * @param {*} newFiber
 * @param {*} newIdx
 */
function placeChild(newFiber, lastPlacedIndex, newIdx) {
  //指定新的fiber在新的挂载索引
  newFiber.index = newIdx
  //如果不需要跟踪副作用
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex
  }
  //获取它的老fiber
  const current = newFiber.alternate
  //如果有，说明这是一个更新的节点，有老的真实DOM。
  if (current !== null) {
    const oldIndex = current.index
    //如果找到的老fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动
    if (oldIndex < lastPlacedIndex) {
      newFiber.flags |= Placement
      return lastPlacedIndex
    } else {
      return oldIndex
    }
  } else {
    //如果没有，说明这是一个新的节点，需要插入
    newFiber.flags |= Placement
    return lastPlacedIndex
  }
}

//删除从currentFirstChild之后所有的fiber节点
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  if (!shouldTrackSideEffects) return
  let childToDelete = currentFirstChild
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
  return null
}

/**
 *给父fiber的deletions和flags赋值
 * @param {*} returnFiber 父fiber
 * @param {*} childToDelete 将要删除的老节点
 * @returns
 */
function deleteChild(returnFiber, childToDelete) {
  if (!shouldTrackSideEffects) return
  const deletions = returnFiber.deletions
  if (deletions === null) {
    returnFiber.deletions = [childToDelete]
    returnFiber.flags |= ChildDeletion
  } else {
    returnFiber.deletions.push(childToDelete)
  }
}
```

### 总结

- 开始第一轮循环 如果老 fiber 有值，新的虚拟 DOM（是多节点）也有值 ，遍历新的虚拟 dom
  - 如果 key 不同则直接结束本轮循环，
  - key 一样，比较 type，试图更新或者试图复用老的 fiber，否则创建新 fiber
  - 检查是否成功复用老 fiber，未成功服用的需要给当前 fiber 的父 fiber 添加删除的标识，将新的 fiber 标记位插入
  - 继续循环
- 开启第二轮遍历
  - 新的虚拟 dom  newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
  - 老的 fiber （oldFiber） 遍历完了,而新的虚拟 dom（newChildren） 还有，将剩下的 newChildren 标记为插入，DIFF 结束
  - newChildren 和 oldFiber 都同时遍历完成，diff 结束
  - newChildren 和 oldFiber 都没有完成，则进行`节点移动`的逻辑
- 移动（遍历新的虚拟 dom， 老的 fiber 放 map, 便利判断节点是否需要删除 移动 复用 新建）
  - 把剩余 oldFibers 放到 map 中， fiber 和 key 或者 index 做映射
  - 开始遍历剩下的虚拟 DOM 子节点
  - 在 map 中 查找该虚拟 dom 节点是否有可用的 fiber 能复用，不能就新建 fiber 并返回
  - 如果在 map 中找到 说明复用成功，则 map 中删除复用的该 fiber
  - 指定新的 fiber 存放位置 ，判断是否需要移动
  - 定义一个 lastPlacedIndex 默认为 0
  - 如果没有老 fibe 直接标记 flag 为 Placement
  - 如果有老 fiber，比较老 fiber 中的索引 oldIndex 和 lastPlacedIndex，
    - 如果 oldIndex< lastPlacedIndex,标记该节点需要移动，并且把 oldIndex 赋值给 lastPlacedIndex
    - 否则说明该节点不需要以移动，无须添加副作用
  - 遍历下一个节点
  - 等全部处理完后，删除 map 中所有剩下的老 fiber
  - commit 阶段处理副作用 更新 删除 或者添加
