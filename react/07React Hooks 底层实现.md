---
title: React Hooks 底层实现
last_update:
  date: 08/31/2024
  author: 高红翔
---

# Hooks 底层实现机制

### 数据结构

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240830212937.png)

**核心数据结构**

当前函数组件的 fiber 的 memoizedState 指向当前函数组件的第一个 Hooks 对象，Hooks 的 next 属性指向下个 Hoosk 对象，是一个单链表。Hooks 的 queue 放一些跟新对象，是一个循环链表，Hooks.memoizedState 放初始化数据，有一个全局变量 workInProgressHook 始终指向正在执行的 hooks

### 1、useReducer

```js
function counter(state, action) {
  if (action.type === "add") return state + action.payload
  return state
}
function FunctionComponent() {
  const [number, setNumber] = React.useReducer(counter, 0)
  let attrs = { id: "btn1" }
  if (number === 6) {
    delete attrs.id
    attrs.style = { color: "red" }
  }
  return (
    <button
      {...attrs}
      onClick={() => {
        setNumber({ type: "add", payload: 1 }) //update1=>update2=>update3=>update1
        setNumber({ type: "add", payload: 2 }) //update2
        setNumber({ type: "add", payload: 3 }) //update3
      }}
    >
      {number}
    </button>
  )
}
```

#### 初次挂载 mountReducer

1.  构建一个 hooks 数据对象

    ```js
    const hook = {
      memoizedState: null, //hook的状态 0
      queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
      next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
    }
    ```

    ```js
    /**
     * 挂载构建中的hook
     * @return workInProgressHook  单向链表
     * */
    function mountWorkInProgressHook() {
      // 创建一个新的hook对象
      const hook = {
        memoizedState: null, //hook的状态 0
        queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
        next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
      }
      if (workInProgressHook === null) {
        //当前函数对应的fiber的状态等于第一个hook对象  永远指向第一个hook
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook
      } else {
        // workInProgressHook.next = hook
        // workInProgressHook = hook
        workInProgressHook = workInProgressHook.next = hook
      }
      return workInProgressHook
    }
    ```

2.  初次挂载，初始化 hooks 对象数据，生成 dispatch 函数

    ```js
    const HooksDispatcherOnMount = {
      useReducer: mountReducer,
    }

    /**
     *
     * @param {*} reducer counter 函数
     * @param {*} initialArg 0
     * @returns [number2, setNumber2 ]
     */
    function mountReducer(reducer, initialArg) {
      // 挂载构建中的 hook
      //返回最新的 workInProgressHook 单向链表 指向最后一个
      const hook = mountWorkInProgressHook()
      hook.memoizedState = initialArg //0 要返回的第一个参数
      const queue = {
        pending: null,
        dispatch: null,
      }
      hook.queue = queue
      //要返回的第二个参数
      const dispatch = (queue.dispatch = dispatchReducerAction.bind(
        null,
        currentlyRenderingFiber, //当前渲染中的 fiber
        queue
      ))

      return [hook.memoizedState, dispatch]
    }
    ```

#### 执行更新 updateReducer

1. 创建更新对象，将更新缓存到 concurrentQueue 中

   ```js
   /**
    * 执行派发动作的方法，它要更新状态，并且让界面重新更新
    * @param {*} fiber function对应的fiber
    * @param {*} queue hook对应的更新队列
    * @param {*} action 派发的动作
    */
   function dispatchReducerAction(fiber, queue, action) {
     //在每个hook里会存放一个更新队列，更新队列是一个更新对象的循环链表update1.next=update2.next=update1
     const update = {
       action, //{ type: 'add', payload: 1 } 派发的动作
       next: null, //指向下一个更新对象
     }
     //把当前的最新的更添的添加更新队列中，并且返回当前的根fiber
     const root = enqueueConcurrentHookUpdate(fiber, queue, update)
     scheduleUpdateOnFiber(root) // 调度更新
   }
   ```

2. 最新的更添的添加更新队列中，为了合并更新

   > 把更新先缓存到 concurrentQueue 数组中 三个为一组 [fiber,hoos.queue,update]

   ```js
   const concurrentQueue = []
   let concurrentQueuesIndex = 0

   /**
    * 把更新先缓存到concurrentQueue数组中
    * @param {*} fiber 函数组件的fiber
    * @param {*} queue 当前hook的quene
    * @param {*} update hooks的更新对象
    */
   function enqueueUpdate(fiber, queue, update) {
     //012 setNumber1 345 setNumber2 678 setNumber3
     concurrentQueue[concurrentQueuesIndex++] = fiber //函数组件对应的fiber
     concurrentQueue[concurrentQueuesIndex++] = queue //要更新的hook对应的更新队列
     concurrentQueue[concurrentQueuesIndex++] = update //更新对象
   }

   /**
    * 把更新队列添加到更新队列中
    * @param {*} fiber 函数组件对应的fiber
    * @param {*} queue 要更新的hook对应的更新队列
    * @param {*} update 更新对象
    * return 返回跟节点 FiberRootNode div#root
    */
   export function enqueueConcurrentHookUpdate(fiber, queue, update) {
     enqueueUpdate(fiber, queue, update)
     return getRootForUpdatedFiber(fiber)
   }
   //
   ```

   3. 从根节点开始执行调度更新，应用 concurrentQueue ，数据 给 hooks.quene 赋值

      ```js
      function prepareFreshStack(root) {
        workInProgress = createWorkInProgress(root.current, null)
        finishQueueingConcurrentUpdates()
      }
      function renderRootSync(root) {
        //开始构建fiber树
        prepareFreshStack(root)
        //开始构建子节点
        workLoopSync()
      }

      // 给函数组件fiber 的 hooks的queue
      export function finishQueueingConcurrentUpdates() {
        const endIndex = concurrentQueuesIndex //9 只是一边界条件
        concurrentQueuesIndex = 0
        let i = 0
        while (i < endIndex) {
          const fiber = concurrentQueue[i++]
          const queue = concurrentQueue[i++]
          const update = concurrentQueue[i++]
          if (queue !== null && update !== null) {
            const pending = queue.pending
            if (pending === null) {
              update.next = update
            } else {
              update.next = pending.next
              pending.next = update
            }
            queue.pending = update
          }
        }
      }
      ```

   4. 重新构建 fiber 树，新的 hooks 链表，执行更新

      ```js
      function updateReducer(reducer) {
        //获取新的hook
        const hook = updateWorkInProgressHook()
        //获取新的hook的更新队列
        const queue = hook.queue
        //获取老的hook
        const current = currentHook
        //获取将要生效的更新队列
        const pendingQueue = queue.pending
        //初始化一个新的状态，取值为当前的状态
        let newState = current.memoizedState
        if (pendingQueue !== null) {
          queue.pending = null
          const firstUpdate = pendingQueue.next
          let update = firstUpdate
          do {
            if (update.hasEagerState) {
              newState = update.eagerState
            } else {
              const action = update.action
              newState = reducer(newState, action)
            }
            update = update.next
          } while (update !== null && update !== firstUpdate)
        }
        hook.memoizedState = newState
        return [hook.memoizedState, queue.dispatch]
      }
      ```

   5. 新的 fiber 树 ，协调 diff 算法 commit 阶段进行更新

#### **总结**

1. 构建一个 hooks 数据对象
2. 初次挂载，初始化 hooks 对象数据，生成 dispatch 函数
3. 执行派发动作的方法，更新状态，并且让界面重新更新
   1. 创建更新队列，给 hook 的 quene 添加更新新队列，
      1. 每次调用 setNumber,先存起来，把更新先缓存到 concurrentQueue 数组中
      2. 从跟节点开始调度更新 从新渲染 diff 算法
      3. 应用 concurrentQueue ，数据 给 hooks.quene 赋值
   2. 重新构建一个新的 fiber 树， 走 updateReducer 逻辑
   3. 复用老的 重新构建 fiberHooks 链表，此次 update 中有东西
   4. 获取新的 hook 的更新队列
   5. 初始化一个新的状态，取值为当前的状态，上次的值
   6. 批量执行里面的函数 然后返回新的状态
   7. 新的 fiber 树 ，协调 diff 算法 commit 阶段进行更新

### 2、useState

```js
function FunctionComponent() {
  console.log("FunctionComponent")
  const [number, setNumber] = React.useState(0)
  //如果使用的是useState，调用setNumber的时候传入的是老状态，则不需要更新，
  return (
    <button
      onClick={() => {
        setNumber(number) //0
        setNumber(number + 1) //1
        setNumber(number + 2) //2
      }}
    >
      {number}
    </button>
  )
}
```

#### 初次挂载 mountState

> 初始化 hooks 对象 ， 给`memoizedState` `queue`赋值， 返回 dispatch 函数和初始值

```js
//useState其实就是一个内置了reducer的useReducer
function baseStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action
}

function mountState(initialState) {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = initialState
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: baseStateReducer, //上一个reducer
    lastRenderedState: initialState, //上一个state
  }
  hook.queue = queue
  const dispatch = (queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue))
  return [hook.memoizedState, dispatch]
}
```

#### 执行更新 updateState

```js
//useState其实就是一个内置了reducer的useReducer
function baseStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action
}
function updateState() {
  return updateReducer(baseStateReducer)
}
```

1. 创建一个更新对象，立即计算新值，判断是否需要构建新的队列

   ```js
   function dispatchSetState(fiber, queue, action) {
     const update = {
       action,
       hasEagerState: false, //是否有急切的更新
       eagerState: null, //急切的更新状态
       next: null,
     }
     //当你派发动作后，我立刻用上一次的状态和上一次的reducer计算新状态
     const { lastRenderedReducer, lastRenderedState } = queue
     const eagerState = lastRenderedReducer(lastRenderedState, action) // 立即计算新的值 始终基于上一次的老值计算
     update.hasEagerState = true
     update.eagerState = eagerState
     if (Object.is(eagerState, lastRenderedState)) {
       //减少重复跟新
       return
     }
     //下面是真正的入队更新，并调度更新逻辑
     const root = enqueueConcurrentHookUpdate(fiber, queue, update)
     scheduleUpdateOnFiber(root)
   }
   ```

   2. 最新的更添的添加更新队列中，为了合并更新

      ```js
      function enqueueUpdate(fiber, queue, update) {
        //012 setNumber1 345 setNumber2 678 setNumber3
        concurrentQueue[concurrentQueuesIndex++] = fiber //函数组件对应的fiber
        concurrentQueue[concurrentQueuesIndex++] = queue //要更新的hook对应的更新队列
        concurrentQueue[concurrentQueuesIndex++] = update //更新对象
      }
      ```

   3. 从根节点开始执行调度更新，应用 concurrentQueue ，数据 给 hooks.quene 赋值

      构建更新循环链表

      ```js
      function prepareFreshStack(root) {
        workInProgress = createWorkInProgress(root.current, null)
        finishQueueingConcurrentUpdates()
      }
      function renderRootSync(root) {
        //开始构建fiber树
        prepareFreshStack(root)
        //开始构建子节点
        workLoopSync()
      }

      // 给函数组件fiber 的 hooks的queue
      export function finishQueueingConcurrentUpdates() {
        const endIndex = concurrentQueuesIndex //9 只是一边界条件
        concurrentQueuesIndex = 0
        let i = 0
        while (i < endIndex) {
          const fiber = concurrentQueue[i++]
          const queue = concurrentQueue[i++]
          const update = concurrentQueue[i++]
          if (queue !== null && update !== null) {
            const pending = queue.pending
            if (pending === null) {
              update.next = update
            } else {
              update.next = pending.next
              pending.next = update
            }
            queue.pending = update
          }
        }
      }
      ```

   4. begin 阶段 重新构建 fiber 树，执行函数组建，生成 新的 hooks 链表，执行更新，返回的新虚拟 dom

      ```js
      function updateReducer(reducer) {
        //获取新的hook
        const hook = updateWorkInProgressHook()
        //获取新的hook的更新队列
        const queue = hook.queue
        //获取老的hook
        const current = currentHook
        //获取将要生效的更新队列
        const pendingQueue = queue.pending
        //初始化一个新的状态，取值为当前的状态
        let newState = current.memoizedState
        if (pendingQueue !== null) {
          queue.pending = null
          const firstUpdate = pendingQueue.next
          let update = firstUpdate
          do {
            // 判断是否有急切的更新 说明已经计算过了 useState 会有
            if (update.hasEagerState) {
              newState = update.eagerState
            } else {
              const action = update.action
              newState = reducer(newState, action)
            }
            update = update.next
          } while (update !== null && update !== firstUpdate)
        }
        hook.memoizedState = newState
        return [hook.memoizedState, queue.dispatch]
      }
      ```

      5. 根据执行函数返回的虚拟 dom 构建新的 fiber 链表 ，commit 阶段提交 执行更新

#### 总结

1. 初次挂载，初始化 hooks 对象 ， 给`memoizedState` `queue`赋值， 返回 dispatch 函数和初始值
2. 更新的时候，创建一个更新对象，立即计算新值，判断是否需要构建新的队列
3. 从根节点开始执行调度更新，应用 concurrentQueue ，数据 给 hooks.quene 赋值,构建更新循环链表
4. begin 阶段 重新构建 fiber 树，执行函数组建，生成 新的 hooks 链表，执行更新，返回的新虚拟 dom
5. 根据执行函数返回的虚拟 dom 构建新的 fiber 链表 ，commit 阶段提交 执行更新

### 3、useEffect

数据结构
![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img202409031535901.png)

```js
const fiber = {
  updateQueue: effect, // 最后一 effect
}

const effect = {
  tag,
  create,
  destroy,
  deps,
  next: null,
}

const hook = {
  memoizedState: effect, //hook的状态 0
  queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
  next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
}
```

#### 挂载 mountEffect

1. 初始化 hooks 对象 ， 给`memoizedState` `queue`赋值未 effect 对象
2. 给当前的函数组件 fiber 添加有 effect 标识，

```js
export const NoFlags = 0b0000
//只有有此flag才会执行effect
export const HasEffect = 0b0001 //1
export const Layout = 0b0100 //4//useLayoutEffect  积极的，会在UI绘制前之前，类似于微任务
export const Passive = 0b1000 //8 //useEffect 消极的，会在UI绘制后执行，类似于宏任务

function mountEffect(create, deps) {
  return mountEffectImpl(PassiveEffect, HookPassive, create, deps)
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  //给当前的函数组件fiber添加flags
  currentlyRenderingFiber.flags |= fiberFlags
  hook.memoizedState = pushEffect(HookHasEffect | hookFlags, create, undefined, nextDeps)
}

/**
 * 挂载构建中的hook
 * */
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, //hook的状态 0
    queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
    next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
    baseState: null, //第一跳过的更新前的状态
    baseQueue: null, //跳过的更新的链表
  }
  if (workInProgressHook === null) {
    //当前函数对应的fiber的状态等于第一个hook对象
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  }
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue()
    currentlyRenderingFiber.updateQueue = componentUpdateQueue
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const lastEffect = componentUpdateQueue.lastEffect
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect
    } else {
      const firstEffect = lastEffect.next
      lastEffect.next = effect
      effect.next = firstEffect
      componentUpdateQueue.lastEffect = effect
    }
  }
  return effect
}
```

3.  commit 阶段执行 effect

先执行同步任务，开启执行调度任务，执行 effect

```js
function commitRootImpl(root) {
  // 根据标识判断是否有要执行的副作用 执行 useEfect 相关函数
  if ((finishedWork.subtreeFlags & Passive) !== NoFlags || (finishedWork.flags & Passive) !== NoFlags) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true
      Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect) // 本次提交之后，放在了宏任务里面了
    }
  }
  if (subtreeHasEffects || rootHasEffect) {
    //当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root)
    //执行layout Effect 相关函数
    commitLayoutEffects(finishedWork, root)
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false
      rootWithPendingPassiveEffects = root
    }
  }
}

function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects
    //执行卸载副作用，destroy
    commitPassiveUnmountEffects(root.current) // 递归执行useEffect 中的destroy，子到父
    //执行挂载副作用 create
    commitPassiveMountEffects(root, root.current) // 递归执行useEffect 中的create,子到父,有返回值会给effect.destroy
  }
}
```

1.  递归执行 useEffect 中的 destroy，子到父

```js
// 执行 useEffect 中的destroy
export function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork)
}

// 递归执行
function commitPassiveUnmountOnFiber(finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveUnmountEffects(finishedWork)
      break
    }
    case FunctionComponent: {
      recursivelyTraversePassiveUnmountEffects(finishedWork)
      if (flags & Passive) {
        //1024
        commitHookPassiveUnmountEffects(finishedWork, HookHasEffect | HookPassive)
      }
      break
    }
  }
}

//执行自己的副作用
function commitHookPassiveUnmountEffects(finishedWork, hookFlags) {
  commitHookEffectListUnmount(hookFlags, finishedWork)
}
// 执行fiber上面所有effect 中的destroy
function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  // 最后一个 effect
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy
        if (destroy !== undefined) {
          destroy()
        }
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

2.  递归执行 useEffect 中的 create，子到父

```js
export function commitPassiveMountEffects(root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork)
}
function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork)
      break
    }
    case FunctionComponent: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork)
      if (flags & Passive) {
        //1024
        commitHookPassiveMountEffects(finishedWork, HookHasEffect | HookPassive)
      }
      break
    }
  }
}

function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork)
}
function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const create = effect.create
        effect.destroy = create()
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

#### updateEffect

1. 通过 hooks 的 memoizedState 获取上一次的数据，拿出 Deps，比较数据，给 effect 标记是否需要执行 effect 函数

```js
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  let destroy
  //上一个老hook
  if (currentHook !== null) {
    //获取此useEffect这个Hook上老的effect对象 create deps destroy
    const prevEffect = currentHook.memoizedState
    destroy = prevEffect.destroy
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps
      // 用新数组和老数组进行对比，如果一样的话
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        //不管要不要重新执行，都需要把新的effect组成完整的循环链表放到fiber.updateQueue中
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps)
        return
      }
    }
  }
  //如果要执行的话需要修改fiber的flags
  currentlyRenderingFiber.flags |= fiberFlags
  //如果要执行的话 添加HookHasEffect flag
  //刚才有同学问 Passive还需HookHasEffect,因为不是每个Passive都会执行的
  hook.memoizedState = pushEffect(HookHasEffect | hookFlags, create, destroy, nextDeps)
}
```

#### **总结**

1. 初始化 hooks 对象 ， 给`memoizedState` `queue`赋值为 effect 对象
2. 给当前的函数组件 fiber 添加有 effect 标识，
3. 更新阶段 通过 hooks 的 memoizedState 获取上一次的数据，拿出 Deps，比较数据，给 effect 标记是否需要执行 effect 函数
4. 提交阶段执行
   - 先执行 dom 的变更
   - 执行 useLayoutEffect 的销毁函数
   - 执行 layout Effect create 函数
   - 开启调度任务
   - 执行 useEffect 的销毁函数
   - 执行 useEffect create 函数

### 3、useEffect

#### 挂载 mountEffect

1. 初始化 hooks 对象 ， 给`memoizedState` `queue`赋值为 effect 对象
2. 给当前的函数组件 fiber 添加有 layoutEffect 标识，

```js
function mountLayoutEffect(create, deps) {
  return mountEffectImpl(UpdateEffect, HookLayout, create, deps)
}
```

#### 挂载 updateEffect

1. 通过 hooks 的 memoizedState 获取上一次的数据，拿出 Deps，比较数据，给 effect 标记是否需要执行 effect 函数,此时已经给 distory 赋值了

```js
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}
```

2. 提交阶段执行
   - 先执行 dom 的变更
   - 执行 useLayoutEffect 的销毁函数
   - 执行 layout Effect create 函数
   - 开启调度任务
   - 执行 useEffect 的销毁函数
   - 执行 useEffect create 函数

```js
function commitRootImpl(root) {
  // 根据标识判断是否有要执行的副作用 执行 useEfect 相关函数
  if ((finishedWork.subtreeFlags & Passive) !== NoFlags || (finishedWork.flags & Passive) !== NoFlags) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true
      Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect) // 本次提交之后，放在了宏任务里面了
    }
  }
  if (subtreeHasEffects || rootHasEffect) {
    //当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root)
    //执行layout Effect 相关函数
    commitLayoutEffects(finishedWork, root)
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false
      rootWithPendingPassiveEffects = root
    }
  }
}
```

```js
export function commitLayoutEffects(finishedWork, root) {
  //老的根fiber
  const current = finishedWork.alternate
  commitLayoutEffectOnFiber(root, current, finishedWork)
}

//开始递归
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork)
      break
    }
    case FunctionComponent: {
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork)
      if (flags & LayoutMask) {
        // LayoutMask=Update=4
        commitHookLayoutEffects(finishedWork, HookHasEffect | HookLayout)
      }
      break
    }
  }
}

function commitHookLayoutEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork)
}
// 执行layout Effect create函数
function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const create = effect.create
        effect.destroy = create()
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}

export function commitMutationEffectsOnFiber(finishedWork, root) {
  const current = finishedWork.alternate
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case FunctionComponent: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      if (flags & Update) {
        commitHookEffectListUnmount(HookHasEffect | HookLayout, finishedWork) // 执行 useLayoutEffect 的销毁函数
      }
      break
    }
    case HostRoot:
    case HostText: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      break
    }
    case HostComponent: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      if (flags & Ref) {
        commitAttachRef(finishedWork)
      }
      //处理DOM更新
      if (flags & Update) {
        //获取真实DOM
        const instance = finishedWork.stateNode
        //更新真实DOM
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps
          const oldProps = current !== null ? current.memoizedProps : newProps
          const type = finishedWork.type
          const updatePayload = finishedWork.updateQueue
          finishedWork.updateQueue = null
          if (updatePayload) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork)
          }
        }
      }
      break
    }
    default:
      break
  }
}

function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy
        if (destroy !== undefined) {
          destroy()
        }
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

#### **总结**

1. 初始化 hooks 对象 ， 给`memoizedState` `queue`赋值为 effect 对象
2. 给当前的函数组件 fiber 添加有 layoutEffect 标识，
3. 更新阶段 通过 hooks 的 memoizedState 获取上一次的数据，拿出 Deps，比较数据，给 effect 标记是否需要执行 effect 函数
4. 提交阶段执行
   - 先执行 dom 的变更
   - 执行 useLayoutEffect 的销毁函数
   - 执行 layout Effect create 函数
   - 开启调度任务
   - 执行 useEffect 的销毁函数
   - 执行 useEffect create 函数

### 5、useRef

#### mountRef

```js
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook()
  const ref = {
    current: initialValue,
  }
  hook.memoizedState = ref
  return ref
}
```

#### updateRef

```js
function updateRef() {
  const hook = updateWorkInProgressHook()
  return hook.memoizedState
}
```

**注意**
commit 阶段，会判断该 fiber 有没有 ref 属性，如果有，会执行 commitAttachRef 函数

```js
function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref
  if (ref !== null) {
    const instance = finishedWork.stateNode
    if (typeof ref === "function") {
      ref(instance)
    } else {
      ref.current = instance
    }
  }
}
```
