---
title: React的事件机制
last_update:
  date: 08/29/2024
  author: 高红翔
---

> 合成事件是围绕浏览器原生事件充当跨浏览器包装器的对象,它们将不同浏览器的行为合并为一个 API,这样做是为了确保事件在不同浏览器中显示一致的属性
> 事件都绑定到了 `div#root` 上 可以大量节省内存占用，减少事件注册,当新增子对象时无需再次对其绑定

## 源码实现

#### 1.**注册事件名**

通过插件系统注册事件名,核心就是给 allNativeEvents 添加事件名

```js
SimpleEventPlugin.registerEvents()

//简单事件插件事件名
export const topLevelEventsToReactNames = new Map()

/**
 * 注册简单事件   给set里面放入事件 map里面做映射
 */
export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i] // click
    const domEventName = eventName.toLowerCase() // click
    const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1) // Click
    // 开始注册简单事件
    registerSimpleEvent(domEventName, `on${capitalizedEvent}`) // click onClick
  }
}

export const allNativeEvents = new Set()
/**
 * 注册两个阶段的事件 给set里面放入事件
 * 当我在页面中触发click事件的时候，会走事件处理函数
 * 事件处理函数需要找到DOM元素对应的要执行React事件 onClick onClickCapture
 * @param {*} registrationName React事件名 onClick
 * @param {*} dependencies 原生事件数组 [click]
 */
export function registerTwoPhaseEvent(registrationName, dependencies) {
  //注册冒泡事件
  registerDirectEvent(registrationName, dependencies)
  //注册冒泡事件
  registerDirectEvent(registrationName + "Capture", dependencies)
}
/**
 * 注册冒泡事件 给set里面放入事件
 * @param {*} registrationName  React事件名 onClick
 * @param {*} dependencies 原生事件数组 [click]
 */
export function registerDirectEvent(registrationName, dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]) // click
  }
}
```

### 2. 给`div#root`绑定事件

1. 遍历所有的原生的事件比如 click,进行监听

   ```js
   /**
    * 监听所有真实的事件
    * @param {*} rootContainerElement FiberRootNode div#root
    */
   export function listenToAllSupportedEvents(rootContainerElement) {
     //监听根容器，也就是div#root只监听一次
     if (!rootContainerElement[listeningMarker]) {
       // 遍历所有的原生的事件比如click,进行监听
       allNativeEvents.forEach((domEventName) => {
         // 注册原生事件 true捕获
         listenToNativeEvent(domEventName, true, rootContainerElement)
         listenToNativeEvent(domEventName, false, rootContainerElement)
       })
     }
   }
   ```

2. 生成 dispatchEvent 函数，绑定两个阶段的事件

```js
/**
 * 增加捕获事件监听器
 * @param {*} targetContainer   目标DOM节点 div#root 容器节点
 * @param {*} domEventName 原生事件 click
 * @param {*} eventSystemFlags 默认是0指的是冒泡  4是捕获
 * @param {*} isCapturePhaseListener  是否是捕获阶段 true false
 */
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
  //创建事件监听函数包裹器带优先级
  const listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags)
  if (isCapturePhaseListener) {
    //增加事件的捕获监听 绑定事件
    addEventCaptureListener(targetContainer, domEventName, listener)
  } else {
    //增加事件的冒泡监听
    addEventBubbleListener(targetContainer, domEventName, listener)
  }
}
```

#### 3. **派发事件冒泡和捕获**

```js
/**
 * 把要执行回调函数添加到dispatchQueue中
 * @param {*} dispatchQueue 派发队列，里面放置我们的监听函数 []
 * @param {*} domEventName DOM事件名 click
 * @param {*} targetInst 目标fiber
 * @param {*} nativeEvent 原生事件 e
 * @param {*} nativeEventTarget 原生事件源 span
 * @param {*} eventSystemFlags  事件系统标题 0 表示冒泡 4表示捕获
 * @param {*} targetContainer  目标容器 div#root
 */
function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  //通过map映射查找对应的属性
  const reactName = topLevelEventsToReactNames.get(domEventName) //click=>onClick
  let SyntheticEventCtor //合成事件的构建函数

  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticMouseEvent //合成鼠标事件
      break
    default:
      break
  }
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0 //是否是捕获阶段
  // 累加单阶段监听
  // 返回捕获或者冒泡的事件函数集合
  const listeners = accumulateSinglePhaseListeners(targetInst, reactName, nativeEvent.type, isCapturePhase)
  //如果有要执行的监听函数的话[onClickCapture,onClickCapture]=[ChildCapture,ParentCapture]
  if (listeners.length > 0) {
    //创建合成事件实例 event
    const event = new SyntheticEventCtor(reactName, domEventName, null, nativeEvent, nativeEventTarget)
    dispatchQueue.push({
      event, //合成事件实例 e.target...
      listeners, //监听函数数组
    })
  }
}
```

1. 获取事件源，拿到真实 DOM 和对应的 fiber

```js
/**
 * 此方法就是委托给容器的回调，当容器div#root在捕获或者说冒泡阶段处理事件的时候会执行此函数
 * @param {*} domEventName 事件名 click
 * @param {*} eventSystemFlags 阶段 0 冒泡 4 捕获
 * @param {*} targetContainer 容器div#root
 * @param {*} nativeEvent 原生的事件
 */
export function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  //获取事件源，它是一个真实DOM
  const nativeEventTarget = getEventTarget(nativeEvent)
  //从真实的DOM节点上获取它对应的fiber实例
  const targetInst = getClosestInstanceFromNode(nativeEventTarget)
  //派发事件为插件事件系统
  dispatchEventForPluginEventSystem(
    domEventName, //click
    eventSystemFlags, //0 4
    nativeEvent, //原生事件
    targetInst, //此真实DOM对应的fiber
    targetContainer //目标容器
  )
}
```

2. 从事件源向上递遍历 fiber，将对应事件映射的函数添加到 listeners

   ```js
   /**
    * 累加单阶段监听
    * @param {*} targetFiber  fiber
    * @param {*} reactName onClick
    * @param {*} nativeEventType click
    * @param {*} isCapturePhase true  false
    * @returns 返回捕获或者冒泡的事件函数集合
    */
   export function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, isCapturePhase) {
     const captureName = reactName + "Capture" //onClickCapture
     //捕获还是冒泡
     const reactEventName = isCapturePhase ? captureName : reactName
     const listeners = [] //先放子span 的事件 再放父h1的事件
     let instance = targetFiber
     while (instance !== null) {
       const { stateNode, tag } = instance
       if (tag === HostComponent && stateNode !== null) {
         // 获取对应 onClickCapture 或者 onClick的回调函数
         const listener = getListener(instance, reactEventName)
         if (listener) {
           listeners.push(createDispatchListener(instance, listener, stateNode))
         }
       }
       instance = instance.return
     }
     return listeners
   }
   ```

3. 创建合成事件实例 event

   为了做浏览器的兼容处理，做到统一。 如重写 preventDefault 和 stopPropagation 等

   ```js
   import assign from "shared/assign"

   function functionThatReturnsTrue() {
     return true
   }
   function functionThatReturnsFalse() {
     return false
   }
   const MouseEventInterface = {
     clientX: 0,
     clientY: 0,
   }

   function createSyntheticEvent(inter) {
     /**
      *合成事件的基类
      * @param {*} reactName React属性名 onClick
      * @param {*} reactEventType click
      * @param {*} targetInst 事件源对应的fiber实例
      * @param {*} nativeEvent 原生事件对象 e
      * @param {*} nativeEventTarget 原生事件源 span 事件源对应的那个真实DOM
      */
     function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
       this._reactName = reactName
       this.type = reactEventType
       this._targetInst = targetInst
       this.nativeEvent = nativeEvent
       this.target = nativeEventTarget
       //把此接口上对应的属性从原生事件上拷贝到合成事件实例上
       for (const propName in inter) {
         if (!inter.hasOwnProperty(propName)) {
           continue
         }
         //this.clientX = e. clientX
         //this.clientY = e. clientY
         this[propName] = nativeEvent[propName]
       }
       //是否已经阻止默认事件
       this.isDefaultPrevented = functionThatReturnsFalse
       //是否已经阻止继续传播
       this.isPropagationStopped = functionThatReturnsFalse
       return this
     }
     assign(SyntheticBaseEvent.prototype, {
       preventDefault() {
         const event = this.nativeEvent
         if (event.preventDefault) {
           event.preventDefault()
         } else {
           event.returnValue = false
         }
         this.isDefaultPrevented = functionThatReturnsTrue
       },
       stopPropagation() {
         const event = this.nativeEvent
         if (event.stopPropagation) {
           event.stopPropagation()
         } else {
           event.cancelBubble = true
         }
         this.isPropagationStopped = functionThatReturnsTrue
       },
     })
     return SyntheticBaseEvent
   }
   export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface)
   ```

4. 将对应的合成事件和函数添加到 dispatchQueue

   ```js
   dispatchQueue.push({
     event, //合成事件实例 e.target...
     listeners, //监听函数数组
   })
   ```

#### 执行对应的回调函数

遍历 dispatchQueue 执行 listeners 里面的函数 区分冒泡和捕获

```js
/**
 * 执行回调函数
 * @param {*} dispatchQueue  调度队列
 * @param {*} eventSystemFlags  冒泡捕获标识
 */
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  //判断是否在捕获阶段  0 冒泡 4 捕获
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i]
    //顺序调度
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase)
  }
}

/**
 * 顺序调度
 * @param {*} event e span
 * @param {*} dispatchListeners [fn]
 * @param {*} inCapturePhase true false
 * @returns
 */
function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
  if (inCapturePhase) {
    //dispatchListeners[子，父]
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { listener, currentTarget } = dispatchListeners[i]
      if (event.isPropagationStopped()) {
        return
      }
      //执行dispatch
      executeDispatch(event, listener, currentTarget)
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { listener, currentTarget } = dispatchListeners[i]
      if (event.isPropagationStopped()) {
        return
      }
      //执行dispatch
      executeDispatch(event, listener, currentTarget)
    }
  }
}
/**
 * 执行dispatch
 * @param {*} event
 * @param {*} listener
 * @param {*} currentTarget
 */
function executeDispatch(event, listener, currentTarget) {
  //合成事件实例currentTarget是在不断的变化的
  // event nativeEventTarget 它的是原始的事件源，是永远不变的
  // event currentTarget 当前的事件源，它是会随着事件回调的执行不断变化的
  event.currentTarget = currentTarget
  listener(event)
}
```

## 总结

- 通过插件系统注册事件名
- 给`div#root`绑定事件
  - 遍历所有的原生的事件比如 click,进行监听
  - 生成 dispatchEvent 函数，绑定两个阶段的事件
- 派发事件冒泡和捕获（点击事件源）
  - 获取事件源，拿到真实 DOM 和对应的 fiber
  - 从事件源向上递遍历 fiber，将对应事件映射的函数添加到 listeners
  - 创建合成事件实例，兼容处理
  - 将对应的合成事件和函数添加到 dispatchQueue
- **区分冒泡和捕获 执行对应的回调函数**
