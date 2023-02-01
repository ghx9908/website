---
title: 创建 FiberRoot
last_update:
  date: 11/15/2022
  author: 高红翔
---

## 创建 ReactDOMRoot

![img](https://static.zhufengpeixun.com/ReactDOMRoot_1664038441123.png)

```js
export function createRoot(container) {
  const root = createContainer(container)
  return new ReactDOMRoot(root)
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)
  return root
}
```

## 创建 RootFiber

![img](https://static.zhufengpeixun.com/FiberRootNode_1664039001283.png)

![img](https://static.zhufengpeixun.com/FiberRootNode_1664074436254.jpg)

### 5.1 ReactFiberRoot.js

```js
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)
  //HostRoot指的就是根节点div#root
  const uninitializedFiber = createHostRootFiber()
  //根容器的current指向当前的根fiber
  root.current = uninitializedFiber
  //根fiber的stateNode,也就是真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root
  return root
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}

export const HostRoot = 3 //容器根节点
export const NoFlags = 0b00000000000000000000000000 //0

/**
 *
 * @param {*} tag fiber的类型 函数组件0  类组件1 原生组件5 根元素3
 * @param {*} pendingProps 新属性，等待处理或者说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag
  this.key = key
  this.type = null //fiber类型，来自于 虚拟DOM节点的type  span div p
  //每个虚拟DOM=>Fiber节点=>真实DOM
  this.stateNode = null //此fiber对应的真实DOM节点  h1=>真实的h1DOM

  this.return = null //指向父节点
  this.child = null //指向第一个子节点
  this.sibling = null //指向弟弟

  //fiber哪来的？通过虚拟DOM节点创建，虚拟DOM会提供pendingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps //等待生效的属性
  this.memoizedProps = null //已经生效的属性

  //每个fiber还会有自己的状态，每一种fiber 状态存的类型是不一样的
  //类组件对应的fiber 存的就是类的实例的状态,HostRoot存的就是要渲染的元素
  this.memoizedState = null
  //每个fiber身上可能还有更新队列
  this.updateQueue = null
  //副作用的标识，表示要针对此fiber节点进行何种操作
  this.flags = NoFlags //自己的副作用
  //子节点对应的副使用标识
  this.subtreeFlags = NoFlags
  //替身，轮替 在后面讲DOM-DIFF的时候会用到
  this.alternate = null
}
// We use a double buffering pooling technique because we know that we'll only ever need at most two versions of a tree.
// We pool the "other" unused  node that we're free to reuse.

// This is lazily created to avoid allocating
// extra objects for things that are never updated. It also allow us to
// reclaim the extra memory if needed.
export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}
```

## 初始化 UpdateQueue

![img](https://static.zhufengpeixun.com/initializeUpdateQueue_1664039386818.png)

### ReactFiberRoot.js

src\react-reconciler\src\ReactFiberRoot.js

```diff
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  const uninitializedFiber = createHostRootFiber();
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
+ initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

```js
export function initializeUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  }
  fiber.updateQueue = queue
}
```

**React 执行分二个阶段**
1.render 计算副作用
2.commit 修改真实 Dom,或者说提交副作用
