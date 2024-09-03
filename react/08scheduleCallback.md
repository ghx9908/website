---
title: scheduleCallback 实现
last_update:
  date: 09/02/2024
  author: 高红翔
---

## scheduleCallback

> React 利用`MessageChannel`来创建一个新的宏任务，用于在当前事件循环结束后尽快执行回调函数。

### MessageChannel

- 目前 `requestIdleCallback` 目前只有 Chrome 支持
- 所以目前 React 利用 [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)模拟了 requestIdleCallback，将回调延迟到绘制操作之后执行
- MessageChannel API 允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据
- MessageChannel 创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过 postMessage 发送数据，而一个端口只要绑定了 onmessage 回调方法，就可以接收从另一个端口传过来的数据
- MessageChannel 是一个宏任务

### 实现 scheduleCallback

1. 调用 scheduleCallback，区分优先级，向最小堆里面添加任务

```js
/**
 * 按优先级执行任务
 * @param {*} priorityLevel 优先级级别
 * @param {*} callback // 回调函数
 */
export function scheduleCallback(priorityLevel, callback) {
  // 获取当前的时候
  const currentTime = getCurrentTime()
  // 此任务的开时间
  const startTime = currentTime
  //超时时间 等待时间过了就得执行
  let timeout
  switch (priorityLevel) {
    case ImmediatePriority: // 立刻执行优先级 局长
      timeout = IMMEDIATE_PRIORITY_TIMEOUT // -1
      break
    case UserBlockingPriority: //用户阻塞操作优先级 用户点击 ，用户输入  副局长
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT // 250ms
      break
    case IdlePriority: // 空闲优先级 临时工
      timeout = IDLE_PRIORITY_TIMEOUT //1073741823
      break
    case LowPriority: // 低优先级 科员
      timeout = LOW_PRIORITY_TIMEOUT //10000
      break
    case NormalPriority: // 正常优先级
    default: //5000
      timeout = NORMAL_PRIORITY_TIMEOUT // 正常优先级过期时间
      break
  }
  //计算此任务的过期时间
  const expirationTime = startTime + timeout
  const newTask = {
    id: taskIdCounter++,
    callback, //回调函数或者说任务函数
    priorityLevel, //优先级别
    startTime, //任务的开始时间
    expirationTime, //任务的过期时间
    sortIndex: expirationTime, //排序依赖
  }
  //向任务最小堆里添加任务，排序的依据是过期时间
  push(taskQueue, newTask)
  //flushWork执行工作，刷新工作，执行任务，司机接人
  requestHostCallback(flushWork)
  return newTask
}
```

2. flushWork 执行工作，刷新工作，执行任务
3. React 利用`MessageChannel`来创建一个新的宏任务，用于在当前事件循环结束后尽快执行回调函数

```js
const channel = new MessageChannel()
var port2 = channel.port2
var port1 = channel.port1
port1.onmessage = performWorkUntilDeadline

function requestHostCallback(workLoop) {
  //先缓存回调函数
  scheduleHostCallback = workLoop //全局便利
  //执行工作直到截止时间
  schedulePerformWorkUntilDeadline()
}
//执行工作直到截止时间
function schedulePerformWorkUntilDeadline() {
  port2.postMessage(null)
}

function performWorkUntilDeadline() {
  if (scheduleHostCallback) {
    // 先获取开始执行任务的时间
    //表示时间片的开始
    startTime = getCurrentTime()
    // 是否有更多的工作要做
    let hasMoreWork = true
    try {
      //执行 flushWork ，并判断有没有返回值
      hasMoreWork = scheduleHostCallback(startTime)
    } finally {
      //执行完以后如果为true,说明还有更多工作要做
      if (hasMoreWork) {
        //继续执行
        schedulePerformWorkUntilDeadline() //再次创建宏任务
      } else {
        scheduleHostCallback = null
      }
    }
  }
}
```

4. 执行工作循环
   1. 取出优先级最高的任务，堆顶元素
   2. 判断此任务是否超时和是否此次执行的时间切片超过 5ms，执行任务
      1. 如果此任务的过期时间小于当前时间，说明超时，需要不中断的直接执行
      2. 如果此任务的过期时间大于当前时间，说明未超时，而且切片时间未超过 5ms，执行下一个任务
   3. 任务都执行完或者超时了，跳出本次循环

```js


function workLoop(startTime) {
  let currentTime = startTime
  //取出优先级最高的任务
  currentTask = peek(taskQueue)
  // 所有任务都执行完或者 某一个任务返回了新的自行任务或者 时间过期
  while (currentTask !== null) {
    //如果此任务的过期时间大于当前时间，也就是说没有过期,并且需要放弃执行 时间片5ms到期
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      //跳出工作循环
      break
    }
    //取出当前的任务中的回调函数 performConcurrentWorkOnRoot
    const callback = currentTask.callback
    if (typeof callback === "function") {
      currentTask.callback = null
      //执行工作，如果返回新的函数，则表示当前的工作没有完成
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime
      const continuationCallback = callback(didUserCallbackTimeout) //返回新函数
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback // 任务没有结束
        return true //还有任务要执行
      }
      //如果此任务已经完成，则不需要再继续执行了，可以把此任务弹出
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue)
      }
    } else {
      pop(taskQueue)
    }
    //如果当前的任务执行完了，或者当前任务不合法，取出下一个任务执行
    currentTask = peek(taskQueue)
  }
  //如果循环结束还有未完成的任务，那就表示hasMoreWork=true
  if (currentTask !== null) {
    return true
  }
  //没有任何要完成的任务了
  return false
}

}
// 是否放弃执行  默认过5ms结束本次执行
function shouldYieldToHost() {
  //用当前时间减去开始的时间就是过去的时间
  const timeElapsed = getCurrentTime() - startTime
  //如果流逝或者说经过的时间小于5毫秒，那就不需要放弃执行
  if (timeElapsed < frameInterval) {
    return false
  } //否则就是表示5毫秒用完了，需要放弃执行
  return true
}
```

5. 如果本次任务返回 true，任务未执行完成，进入下一轮消息推送

   ```js
   function performWorkUntilDeadline() {
     if (scheduleHostCallback) {
       // 先获取开始执行任务的时间
       //表示时间片的开始
       startTime = getCurrentTime()
       // 是否有更多的工作要做
       let hasMoreWork = true
       try {
         //执行 flushWork ，并判断有没有返回值
         hasMoreWork = scheduleHostCallback(startTime)
       } finally {
         //执行完以后如果为true,说明还有更多工作要做
         if (hasMoreWork) {
           //继续执行
           schedulePerformWorkUntilDeadline()
         } else {
           scheduleHostCallback = null
         }
       }
     }
   }
   ```

### 总结

1. 调用 scheduleCallback，区分优先级，向最小堆里面添加任务
2. flushWork 执行工作，刷新工作，执行任务
3. React 利用`MessageChannel`来创建一个新的宏任务，用于在当前事件循环结束后尽快执行回调函数
4. 执行工作循环
   1. 取出优先级最高的任务，堆顶元素
   2. 判断此任务是否超时和是否此次执行的时间切片超过 5ms，执行任务
      1. 如果此任务的过期时间小于当前时间，说明超时，需要不中断的直接执行
      2. 如果此任务的过期时间大于当前时间，说明未超时，而且切片时间未超过 5ms，执行下一个任务
   3. 任务都执行完或者超时了，跳出本次循环
5. 如果本次任务返回 true，任务未执行完成，进入下一轮消息推送
