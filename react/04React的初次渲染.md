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

4. 开始调度更新，初始化栈

5. 开始递归构建 fiber 树

6. 调用 beginWork 方法 ，目标是根据新虚拟 DOM 构建新的 fiber 子链表 child .sibling

   1. renderRootSync(root)同步构建 fiber 树

      workInProgress = createWorkInProgress(root.current, null)

   2. 创建一个 root.current 对应的 workInProgress

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141930.png?token=AU2NEGBWOQRXOMZ6BS3VHD3GZ3A3G)

   3. 递归构建子节点 workLoopSync() 执行工作单元 一个 fiber 就是一个工作单元
      ```js
      function workLoopSync() {
        while (workInProgress !== null) {
          performUnitOfWork(workInProgress)
        }
      }
      ```
   4. 处理节点，将 fiber 中的 updataQuene 放的虚拟 dom 取出来放到 memoizedState 上
      workInProgress.memoizedState={ element }

   5. reconcileChildren 协调子节点 diff 算法，看看有没有老 fiber 有的话就是 diff 算法 update 没有的话就是 mount

      - 根 fiber，走 updata，用我新的 element 和老的 fiber 的子 fiber 进行比较 和创建
      - 没有老 fiber 的 创建子 fiber 链表并让第一个子 fiber 指向父 fiber

   6. 根据虚拟 DOM 创建新的 Fiber 节点,并且让新创建的 fiber 的 return 指向父 fiber，给 fiber 上面添加副作用 Placement

   7. const next = beginWork(current, unitOfWork) //返回新创建的第一个子 fiber

    看有没有子 fiber 节点，话 workInProgress = next

   8. 回头执行第三步

7. completeUnitOfWork(unitOfWork)完成工作单元

   > 执行一个 fiber 的完成工作,如果是原生组件的话就是创建真实的 DOM 节点
   >
   > 给 fiber.stateNode, fiber.fibersubtreeFlags fiber.flags 赋值

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141900.png?token=AU2NEGG3X2COZLV43K7XAGTGZ3AZM)

8. commitRoot(root) 开始进入提交 阶段，就是执行副作用，修改真实 DOM

**如何处理删除**

- begin work 阶段 当检测到 key 不同的时候，给父 fiber 的 deletions=[deletedFiber]赋值和 flags 做上删除的标记；
- 在 commit 阶段 从根节点递归遍历处理变更的时候，先通过父 fiber，找到最近真实的 DOM 节点，然后递归从里向外删除它的真实 dom，目的是为了处理一些组件销毁时候如 uesEffect 的副作用。
