---
title: React的初次渲染
last_update:
  date: 08/28/2025
  author: 高红翔
---

## React 的初次渲染

1. 通过 babel 编译将写的 html 标签转换成 jsx 函数，执行 jsx 函数生成虚拟 dom

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141604.png?token=AU2NEGBPTRPKZWQAWSMSER3GZ3AOI)

2. 调用 creatRoot 方法会创建一个 ReactDOMRoot 一个实例
   1. 其中会创建根 fiber，进行事件机制的绑定 初始化跟新队列

```JS
const root = createRoot(document.getElementById("root"))
```

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141640.png?token=AU2NEGBXZQYAHECYZ2ICM4DGZ3AQS)

3. 调用 root 的 render 方法先把 element 虚拟 dom 放到 HostRootFiber 的更新队列中

   - 这是一个循环链表

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141715.png?token=AU2NEGDIJXIP754DS262GGTGZ3ASW)

4. 开始调度更新，初始化栈（初次未空，更新的时候会给 fiber 的 update 赋值）

   ```js
   //根节点调度跟新
   scheduleUpdateOnFiber(root, current, lane, eventTime)

   // 并发渲染
   function renderRootConcurrent(root, lanes) {
     //因为在构建fiber树的过程中，此方法会反复进入，会进入多次
     //只有在第一次进来的时候会创建新的fiber树，或者说新fiber
     if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
       prepareFreshStack(root, lanes)
     }
     //在当前分配的时间片(5ms)内执行fiber树的构建或者说渲染，
     // 开始工作循环
     workLoopConcurrent()
     //如果 workInProgress不为null，说明fiber树的构建还没有完成
     if (workInProgress !== null) {
       return RootInProgress
     }
     //如果workInProgress是null了说明渲染工作完全结束了
     return workInProgressRootExitStatus
   }

   // 构建workInProgress fiber
   function prepareFreshStack(root, renderLanes) {
     workInProgress = createWorkInProgress(root.current, null)
     workInProgressRootRenderLanes = renderLanes
     workInProgressRoot = root
     finishQueueingConcurrentUpdates()
   }

   export function finishQueueingConcurrentUpdates() {
     const endIndex = concurrentQueuesIndex //9 只是一边界条件
     concurrentQueuesIndex = 0
     let i = 0
     while (i < endIndex) {
       const fiber = concurrentQueues[i++]
       const queue = concurrentQueues[i++]
       const update = concurrentQueues[i++]
       const lane = concurrentQueues[i++]
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

5. 开始递归构建 fiber 树，执行工作单元

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
   ```

6. 调用 beginWork 方法 ，根据老 fiber 和新的虚拟 dom 构建新 fiber(diff 算法)

   ```js
   /**
    * 目标是根据新虚拟DOM构建新的fiber子链表
    * @param {*} current 老fiber
    * @param {*} workInProgress 新的fiber h1
    * @returns
    */
   export function beginWork(current, workInProgress, renderLanes) {
     //在构建fiber树之后清空lanes
     workInProgress.lanes = 0
     switch (workInProgress.tag) {
       // 因为在React里组件其实有两种，一种是函数组件，一种是类组件，但是它们都是都是函数
       case IndeterminateComponent:
         return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes)
       case FunctionComponent: {
         const Component = workInProgress.type
         const nextProps = workInProgress.pendingProps
         return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes)
       }
       case HostRoot:
         return updateHostRoot(current, workInProgress, renderLanes)
       case HostComponent:
         return updateHostComponent(current, workInProgress, renderLanes)
       case HostText:
         return null
       default:
         return null
     }
   }

   /**
    * 构建原生组件的子fiber链表
    * @param {*} current 老fiber
    * @param {*} workInProgress 新fiber h1
    */
   function updateHostComponent(current, workInProgress) {
     const { type } = workInProgress
     const nextProps = workInProgress.pendingProps
     let nextChildren = nextProps.children
     //判断当前虚拟DOM它的儿子是不是一个文本独生子
     const isDirectTextChild = shouldSetTextContent(type, nextProps)
     if (isDirectTextChild) {
       nextChildren = null
     }
     reconcileChildren(current, workInProgress, nextChildren)
     return workInProgress.child
   }
   ```

   1. 并发构建 fiber 树

   2. 创建一个 root.current 对应的 workInProgress

      ```js
      workInProgress = createWorkInProgress(root.current, null)
      ```

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141930.png?token=AU2NEGBWOQRXOMZ6BS3VHD3GZ3A3G)

   3. 递归构建子节点 workLoopSync() 执行工作单元 一个 fiber 就是一个工作单元

      ```js
      function workLoopSync() {
        while (workInProgress !== null) {
          performUnitOfWork(workInProgress)
        }
      }
      ```

   4. reconcileChildren 协调子节点 diff 算法，根据 老 fiber 和新的虚拟 dom 协调，尽可能服用老 fiber，

   5. 根据虚拟 DOM 创建新的 Fiber 节点,并且让新创建的 fiber 的 return 指向父 fiber，给 fiber 上面添加副作用 Placement

   6. 返回新创建的第一个子 fiber，赋给 workInProgress，递归执行

   7. 没有子 fiber 执行该 fiber 的完成阶段任务

7. completeUnitOfWork(unitOfWork)完成工作单元

   > 执行一个 fiber 的完成工作,如果是原生组件的话就是创建真实的 DOM 节点
   >
   > 给 fiber.stateNode, fiber.fibersubtreeFlags fiber.flags 赋值 标记副作用

   ```js
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

   /**
    * 完成一个fiber节点
    * @param {*} current 老fiber
    * @param {*} workInProgress 新的构建的fiber
    */
   export function completeWork(current, workInProgress) {
     const newProps = workInProgress.pendingProps
     switch (workInProgress.tag) {
       case HostRoot:
         bubbleProperties(workInProgress)
         break
       //如果完成的是原生节点的话
       case HostComponent:
         ///现在只是在处理创建或者说挂载新节点的逻辑，后面此处分进行区分是初次挂载还是更新
         //创建真实的DOM节点
         const { type } = workInProgress
         //如果老fiber存在，并且老fiber上真实DOM节点，要走节点更新的逻辑
         if (current !== null && workInProgress.stateNode !== null) {
           updateHostComponent(current, workInProgress, type, newProps)
           if ((current.ref !== workInProgress.ref) !== null) {
             markRef(workInProgress)
           }
         } else {
           const instance = createInstance(type, newProps, workInProgress)
           //把自己所有的儿子都添加到自己的身上
           appendAllChildren(instance, workInProgress)
           workInProgress.stateNode = instance
           finalizeInitialChildren(instance, type, newProps)
           if (workInProgress.ref !== null) {
             markRef(workInProgress)
           }
         }
         bubbleProperties(workInProgress)
         break
       case FunctionComponent:
         bubbleProperties(workInProgress)
         break
       case HostText:
         //如果完成的fiber是文本节点，那就创建真实的文本节点
         const newText = newProps
         //创建真实的DOM节点并传入stateNode
         workInProgress.stateNode = createTextInstance(newText)
         //向上冒泡属性
         bubbleProperties(workInProgress)
         break
     }
   }

   export function createInstance(type, props, internalInstanceHandle) {
     const domElement = document.createElement(type)
     //预先缓存fiber节点到DOM元素上
     precacheFiberNode(internalInstanceHandle, domElement)
     //把属性直接保存在domElement的属性上
     updateFiberProps(domElement, props)

     return domElement
   }
   ```

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141900.png?token=AU2NEGG3X2COZLV43K7XAGTGZ3AZM)

8. fiber 树都构建完成 进入体检阶段

9. commitRoot(root) 开始进入提交 阶段，就是执行副作用，修改真实 DOM

   1. 先看有没有需要删除的，递归删除子 fiber ，要执行副作用
   2. 插入或者移动，需要找到最近的不需要移动的真实弟弟，进行插入

```js
/**
 * 遍历fiber树，执行fiber上的副作用
 * @param {*} finishedWork fiber节点
 * @param {*} root 根节点
 */
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
        commitHookEffectListUnmount(HookHasEffect | HookLayout, finishedWork)
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

/**
 * 递归遍历处理变更的作用
 * @param {*} root 根节点
 * @param {*} parentFiber 父fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  //先把父fiber上该删除的节点都删除
  const deletions = parentFiber.deletions
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i]
      commitDeletionEffects(root, parentFiber, childToDelete)
    }
  }
  //再去处理剩下的子节点
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root)
      child = child.sibling
    }
  }
}

//处理自己身上的副作用，插入 或者移动
function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork
  //如果此fiber要执行插入操作的话
  if (flags & Placement) {
    //进行插入操作，也就是把此fiber对应的真实DOM节点添加到父真实DOM节点上
    commitPlacement(finishedWork)
    //把flags里的Placement删除
    finishedWork.flags & ~Placement
  }
}

/**
 * 把此fiber的真实DOM插入到父DOM里
 * @param {*} finishedWork
 */
function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork)
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo
      const before = getHostSibling(finishedWork) //获取最近的弟弟真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent)
      break
    }
    case HostComponent: {
      const parent = parentFiber.stateNode
      const before = getHostSibling(finishedWork)
      insertOrAppendPlacementNode(finishedWork, before, parent)
      break
    }
    default:
      break
  }
}
```

总结

- jsx 转换，上次虚拟 dom
- 创建跟 fiber
- 开启工作循环，执行工作单元 构建 fiber 树，给 fiber 增加 flag
- 完成工作单元的构建，创建真实的 dom，更新属性，此时没有儿子
- 提交阶段 ，执行副作用，修改真实 DOM
