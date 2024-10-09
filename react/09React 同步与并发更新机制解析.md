---
title: React 同步与并发更新机制解析：从批处理到 Fiber 树构建
last_update:
  date: 09/08/2024
  author: 高红翔
---

## React 同步与并发更新机制解析：从批处理到 Fiber 树构建

React 在性能优化上进行了大量的研究与迭代，特别是在引入了 **Fiber 架构** 和 **Concurrent Mode（并发模式）** 后，使得 React 的更新机制更加灵活、高效。本文将通过 React 同步更新与并发更新机制的源代码解析，深入理解其中的更新流程及背后的批处理逻辑。

---

### 1. React 状态更新的批处理机制

在 React 中，当组件调用 `setState` 更新状态时，不会立即触发重新渲染。React 为了优化性能，在同一事件循环中会将多个状态更新合并（**批处理**），只进行一次渲染。这意味着如果你在同一个事件回调中多次调用 `setState`，React 会合并这些更新，减少渲染次数。

例如：

```js
function Counter() {
  const [number, setNumber] = React.useState(0)
  return (
    <button
      onClick={() => {
        setNumber(number + 1)
        setNumber(number + 1)
      }}
    >
      {number}
    </button>
  )
}
```

在上面的代码中，即便我们调用了两次 `setNumber`，React 最终只会触发一次渲染，原因就是 React 会批处理这些状态更新。

#### 1.1 批处理更新的原理

我们可以从 `ensureRootIsScheduled` 函数来分析 React 的批处理更新机制。React 将更新的任务进行调度，并根据任务的优先级判断是否需要立即执行。

```js
// 根节点调度跟新
function ensureRootIsScheduled(root, currentTime) {
  //先获取当前根上执行任务
  const existingCallbackNode = root.callbackNode
  //把所有饿死的赛道标记为过期
  markStarvedLanesAsExpired(root, currentTime)
  //获取当前优先级最高的车道
  const nextLanes = getNextLanes(root, workInProgressRootRenderLanes) // 初次渲染16
  //如果没有要执行的任务
  if (nextLanes === NoLanes) {
    return
  }
  //获取新的调度优先级
  let newCallbackPriority = getHighestPriorityLane(nextLanes) //16
  //获取现在根上正在运行的优先级
  const existingCallbackPriority = root.callbackPriority
  //如果新的优先级和老的优先级一样，则可以进行批量更新  批处理更新的原理
  if (existingCallbackPriority === newCallbackPriority) {
    return
  }
  if (existingCallbackNode !== null) {
    console.log("cancelCallback")
    Scheduler_cancelCallback(existingCallbackNode)
  }
  //新的回调任务
  let newCallbackNode = null
  //如果新的优先级是同步的话  // SyncLane = 1
  if (newCallbackPriority === SyncLane) {
    //先把performSyncWorkOnRoot添回到同步队列中
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
    //再把flushSyncCallbacks放入微任务 执行performSyncWorkOnRoot同步任务
    queueMicrotask(flushSyncCallbacks)
    //如果是同步执行的话
    newCallbackNode = null
  } else {
    //如果不是同步，就需要调度一个新的任务
    let schedulerPriorityLevel
    //把lane转成事件优先级 1 4 16
    switch (lanesToEventPriority(nextLanes)) {
      // 将事件优先级变为调度优先级
      case DiscreteEventPriority: //1离散事件
        schedulerPriorityLevel = ImmediateSchedulerPriority
        break
      case ContinuousEventPriority: // 4连续事件
        schedulerPriorityLevel = UserBlockingSchedulerPriority
        break
      case DefaultEventPriority: // 16默认事件
        schedulerPriorityLevel = NormalSchedulerPriority
        break
      case IdleEventPriority: //空闲事件优先级
        schedulerPriorityLevel = IdleSchedulerPriority
        break
      default:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
    }
    // 并发更新
    newCallbackNode = Scheduler_scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))
  }
  //在根节点的执行的任务是newCallbackNode
  root.callbackNode = newCallbackNode
  root.callbackPriority = newCallbackPriority
}
```

ReactFiberSyncTaskQueue.js

```js
//同步队列
let syncQueue = null
//是否正在执行同步队列
let isFlushingSyncQueue = false
//调度同步执行  给syncQueue赋值
export function scheduleSyncCallback(callback) {
  if (syncQueue === null) {
    syncQueue = [callback]
  } else {
    syncQueue.push(callback)
  }
}
//刷新执行清空回调
export function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    isFlushingSyncQueue = true
    let i = 0
    //暂存当前的更新优先级
    const previousUpdatePriority = getCurrentUpdatePriority()
    try {
      const isSync = true
      const queue = syncQueue
      //把优先级设置为同步优先级
      setCurrentUpdatePriority(DiscreteEventPriority)
      for (; i < queue.length; i++) {
        let callback = queue[i]
        do {
          callback = callback(isSync)
        } while (callback !== null)
      }
      syncQueue = null
    } finally {
      setCurrentUpdatePriority(previousUpdatePriority)
      isFlushingSyncQueue = false
    }
  }
}
```

当你点击按钮时，`setNumber` 会触发 `dispatchSetState`，然后 React 会将这些更新任务存入队列，并通过 `scheduleUpdateOnFiber` 开始从根节点进行更新调度。核心机制是通过 `lane` 优先级来管理更新任务的执行顺序。

如果两次调用 `setState` 的更新优先级相同，React 会合并这些更新任务，触发一次渲染。

---

### 2. 同步更新 vs 并发更新

在 React 18 中，引入了 **Concurrent Mode**，使得 React 更新机制能够支持时间分片（time-slicing），从而允许在更复杂的场景中实现更加流畅的用户交互。

##### 2.1 同步更新

同步更新是指在同一个事件循环中，React 会一气呵成地完成 Fiber 树的构建和渲染。这种更新方式不会中断，因此在构建复杂组件时可能会造成阻塞。

在同步更新的代码中：

```js
/**
 * 在根上执行同步工作
 */
function performSyncWorkOnRoot(root) {
  //获得最高优的lane
  const lanes = getNextLanes(root)
  //渲染新的fiber树
  renderRootSync(root, lanes)
  //获取新渲染完成的fiber根节点
  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork
  commitRoot(root)
  return null
}

function renderRootSync(root, renderLanes) {
  //如果新的根和老的根不一样，或者新的渲染优先级和老的渲染优先级不一样
  if (root !== workInProgressRoot || workInProgressRootRenderLanes !== renderLanes) {
    prepareFreshStack(root, renderLanes)
  }
  workLoopSync()
  return RootCompleted
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}
```

`performSyncWorkOnRoot` 会同步执行 Fiber 树的渲染，并将最终结果提交到 DOM。

##### 2.2 并发更新

并发更新允许 React 将更新过程分为多个小的时间片段（time slices），每个时间片段可以被其他高优先级的任务中断。这种更新模式不仅提高了 React 应对复杂 UI 交互的能力，也显著提升了用户体验。

并发更新的核心逻辑在 `performConcurrentWorkOnRoot` 函数中：

```js
/**
 * 并发模式下执行根节点上的任务
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root, didTimeout) {
  //先获取当前根节点上的任务
  const originalCallbackNode = root.callbackNode
  //获取当前优先级最高的车道
  const lanes = getNextLanes(root, NoLanes) //16
  if (lanes === NoLanes) {
    return null
  }
  //如果不包含阻塞的车道，并且没有超时，就可以并行渲染,就是启用时间分片
  //所以说默认更新车道是同步的,不能启用时间分片
  //是否不包含阻塞车道
  const nonIncludesBlockingLane = !includesBlockingLane(root, lanes)
  //是否不包含过期的车道
  const nonIncludesExpiredLane = !includesExpiredLane(root, lanes)
  //时间片没有过期
  const nonTimeout = !didTimeout
  //三个变量都是真，才能进行时间分片，也就是进行并发渲染，也就是可以中断执行
  const shouldTimeSlice = nonIncludesBlockingLane && nonIncludesExpiredLane && nonTimeout
  // console.log('shouldTimeSlice', shouldTimeSlice);
  //执行渲染，得到退出的状态
  const exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes)
  //如果不是渲染中的话，那说明肯定渲染完了
  if (exitStatus !== RootInProgress) {
    const finishedWork = root.current.alternate
    root.finishedWork = finishedWork
    commitRoot(root)
  }
  //说明任务没有完成
  if (root.callbackNode === originalCallbackNode) {
    //把此函数返回，下次接着干
    return performConcurrentWorkOnRoot.bind(null, root)
  }
  return null
}

function renderRootConcurrent(root, lanes) {
  //因为在构建fiber树的过程中，此方法会反复进入，会进入多次
  //只有在第一次进来的时候会创建新的fiber树，或者说新fiber
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes)
  }
  //在当前分配的时间片(5ms)内执行fiber树的构建或者说渲染，
  workLoopConcurrent()
  //如果 workInProgress不为null，说明fiber树的构建还没有完成
  if (workInProgress !== null) {
    return RootInProgress
  }
  //如果workInProgress是null了说明渲染工作完全结束了
  return workInProgressRootExitStatus
}

function workLoopConcurrent() {
  //如果有下一个要构建的fiber并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

在并发模式下，`renderRootConcurrent` 会构建 Fiber 树，并根据时间片的分配来决定是否需要暂停，允许其他高优先级任务打断当前渲染工作。

---

#### 3. 并发模式与 Fiber 架构

**Fiber 架构** 是 React 为了解决大规模 UI 渲染时的性能瓶颈而设计的一种调度机制。它使得 React 的渲染过程可中断、可恢复。通过 Fiber 树的构建，React 能够将渲染工作分片处理，进而提高响应速度。

在 Fiber 树构建过程中，`performUnitOfWork` 是一个关键函数：

```js
/**
 * 执行一个工作单元
 * @param {*} unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  //获取新的fiber对应的老fiber
  const current = unitOfWork.alternate
  //完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork, workInProgressRootRenderLanes)
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    //如果没有子节点表示当前的fiber已经完成了
    completeUnitOfWork(unitOfWork)
  } else {
    //如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork
  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return
    //执行此fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork)
    //如果有弟弟，就构建弟弟对应的fiber子链表
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return
    }
    //如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    //也就是说一个父fiber,所有的子fiber全部完成了
    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)
  //如果走到了这里，说明整个fiber树全部构建完毕,把构建状态设置为空成
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted
  }
}
```

`performUnitOfWork` 逐个处理 Fiber 节点，构建整棵 Fiber 树。而在并发模式下，如果当前时间片用完，React 会通过 `shouldYield` 判断是否需要暂停渲染，避免主线程长时间被阻塞。

---

#### 4. React 18 的自动批处理

React 18 引入了 **自动批处理（Automatic Batching）** 功能，使得批处理不仅限于 React 的事件处理函数，在异步代码（例如 `Promise`、`setTimeout`）中也会自动合并 `setState`，减少不必要的渲染。

例如：

```js
const handleClick = () => {
  Promise.resolve().then(() => {
    setNumber((n) => n + 1)
    setNumber((n) => n + 1)
  })
}
```

即便是在异步任务中，React 也会批处理这些状态更新，合并为一次渲染。

如果你希望在异步任务中立即触发更新，可以使用 `flushSync`：

```js
flushSync(() => setNumber((n) => n + 1))
```

---

#### 5. 结语

React 的更新机制经过了多次演进，从最初的同步更新到 Fiber 架构，再到支持并发更新，React 一直在性能优化和用户体验之间寻找平衡。通过批处理、时间分片和自动批处理，React 能够高效处理大量状态更新，同时保持 UI 的流畅响应。

理解这些底层机制不仅有助于我们编写高性能的 React 应用，还能帮助我们更好地处理复杂的 UI 场景，确保应用的响应速度和用户体验。
