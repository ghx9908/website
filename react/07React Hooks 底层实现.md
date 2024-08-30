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

1. 创建更新对象，为循环链表 update1.next=update2.next=update1

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
