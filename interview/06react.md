---
sidebar_position: 7
title: react 面试题
---

## react 的事件机制 ？

1. 优点

- 事件都绑定到了 `div#root` 上 可以大量节省内存占用，减少事件注册,当新增子对象时无需再次对其绑定
- 合成事件：围绕浏览器原生事件充当跨浏览器包装器的对象,它们将不同浏览器的行为合并为一个 API,这样做是为了确保事件在不同浏览器中显示一致的属性（重写 preventDefault 和 stopPropagation）

2. 底层实现

- 通过插件系统注册事件名
- 给`div#root`绑定事件
  - 遍历所有的原生的事件比如 click,进行监听
  - 生成 dispatchEvent 函数，绑定两个阶段的事件
- 派发事件冒泡和捕获（点击事件源）
  - 获取事件源，拿到真实 DOM 和对应的 fiber
  - 从事件源向上递遍历 fiber，将对应事件映射的函数添加到 listeners
  - 创建合成事件实例，兼容处理
  - 将对应的合成事件和函数添加到 dispatchQueue
- 区分冒泡和捕获 执行对应的回调函数

## 并发模式

React 的 **并发模式（Concurrent Mode）** 是 React 为了解决复杂应用中 UI 更新卡顿、提高用户体验而引入的一种新特性。它通过并发处理多个任务，让 React 能够更灵活、更智能地调度渲染任务，从而提升应用的响应性和性能。

并发模式的核心目标是让 React 应用可以更自然地处理复杂的用户交互场景，如大型表单的输入响应、动画渲染，以及背景数据加载等任务，而不会影响应用的流畅度。React 并发模式基于其底层的 **Fiber** 架构。

### 并发模式的核心概念

1. **可中断渲染**：
   - 在传统的 React 渲染模型中，渲染任务是同步的，即一旦开始渲染任务，它会阻塞直到渲染完成。这意味着如果渲染任务较大，用户的交互可能会变得迟钝。
   - 并发模式允许 React 在执行较长时间的渲染任务时，可以中途暂停这个任务，以便先处理更高优先级的任务，比如用户输入、动画等。
2. **任务优先级调度**：
   - React 并发模式通过引入任务优先级，使得渲染和更新任务可以根据重要性进行调度。高优先级的任务（如用户交互）会优先执行，而低优先级任务（如背景数据加载）则可以稍后执行或者被延迟。
   - 这种优先级调度确保了 React 应用在用户交互密集的场景下，仍然能够保持响应迅速。
3. **时间切片（Time Slicing）**：
   - 并发模式利用了时间切片技术，将一个大的渲染任务分成多个小任务执行。每个时间片结束时，React 可以检查当前的任务优先级，决定是继续当前任务，还是切换到其他更高优先级的任务。
   - 这使得 React 可以在不同的任务之间切换，保持 UI 的流畅性。
4. **暂停和恢复渲染**：
   - React 在并发模式下，可以暂停某个渲染任务，并在未来的某个时刻恢复它。这种灵活性使得 React 能够更好地应对复杂场景下的 UI 更新，避免长时间阻塞主线程的情况。
5. **并行处理多个状态更新**：
   - 在并发模式中，React 可以并行处理多个状态更新，而不是按顺序处理。这使得 React 能够在后台准备和执行多个渲染任务，并在适当的时机提交最优结果。

### 并发模式的应用场景

- **用户输入与渲染之间的平衡**：并发模式允许 React 在用户输入时中断渲染任务，优先处理输入事件，避免因长时间渲染任务导致输入延迟。
- **平滑的动画和过渡效果**：React 能够优先处理动画或过渡效果，让界面保持流畅，同时后台完成其他的更新任务。
- **复杂的背景数据加载**：并发模式让 React 在加载和更新数据时，可以将部分渲染任务推迟到更合适的时机，确保不会影响用户的交互体验。

## diff 算法

> 新的虚拟 dom 和老的 fiber 树构建新的 fiber 树

### 单节点

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230220164823.png)

### 多节点

- 开始第一轮循环 如果老 fiber 有值，新的虚拟 DOM（是多节点）也有值 ，遍历新的虚拟 dom
  - 如果 key 不同则直接结束本轮循环，
  - key 一样，比较 type，试图更新或者试图复用老的 fiber，否则创建新 fiber
  - 检查是否成功复用老 fiber，未成功服用的需要给当前 fiber 的父 fiber 添加删除的标识，将新的 fiber 标记位插入
  - 继续循环
- 开启第二轮遍历
  - 新的虚拟 dom  newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
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



## 谈谈你对react的理解

- **React 是一个用于构建用户界面的 JavaScript 库**。它通过组件化的方式，将页面划分为多个独立的部分，让开发者可以更加模块化、高效地构建 Web 应用。React 倡导数据和视图的分离，将视图渲染抽象成一个单向数据流的过程。当数据发生变化时，React 可以高效地更新视图，使得开发者可以更加专注于业务逻辑。

  React 的特点包括：

  1. **组件化：**React 应用由多个独立组件构成，每个组件有自己的状态和生命周期，可以被复用，使得应用结构更加清晰。
  2. **虚拟 DOM：**React 通过虚拟 DOM 的方式，减少了真实 DOM 的操作，提高了页面更新的效率。
  3. **单向数据流：**React 数据的流动是单向的，自上而下传递数据，子组件不会直接修改父组件的数据。
  4. **生命周期：**React 组件具有生命周期方法，可以在组件创建、更新和销毁时执行相应的操作。
  5. **JSX：**React 使用 JSX 语法，将组件和模板结合在一起，方便开发者编写和维护代码。
  6. **强大的生态圈**：React 生态圈非常庞大，有许多周边库可以提供各种功能，如 Redux、React Router、Ant Design 等。

  总之，React 是一个非常强大的前端库，它的组件化、虚拟 DOM、单向数据流等特性可以帮助开发者更加高效、清晰地构建 Web 应用。

## 谈谈Vue和React的区别？

都**使用虚拟 DOM、提供了组件化开发等特性。**

1. **模板语法**：Vue 使**用模板语法（**template syntax），而 React 使用 **JSX 语法**（JavaScript XML）。模板语法更接近于传统的 HTML 书写方式，可以让开发者更容易地理解和维护代码；JSX 则允许开发者在 JavaScript 中编写 XML 标签，使得组件开发更加灵活。
2. **数据绑定：Vue 的数据双向绑定比 React 更加方便实现，**因为 Vue 内置了 v-model 指令。**React 实现数据绑定需要手动进行控制，例如使用 setState 方法来**修改状态并触发重新渲染。
3. **组件化开发**：Vue 和 React 都具备组件化开发的能力，但是 **Vue 在组件开发上的语法和规范更加严谨**，例如在组件中必须定义 props 和 data 等属性，并且每个组件都必须包含一个 template。
4. **性能：**Vue 的性能优化比 React 更加简单，因为 Vue 自带了模板编译和响应式系统。而 React 需要手动对组件进行优化，例如使用 shouldComponentUpdate 方法来避免不必要的渲染。
5. **社区支持**：React 拥有更加庞大的社区支持，因此在生态方面更加丰富，例如 Redux、React Native 等扩展库和工具。而 Vue 在中国的支持度非常高，因此在中文文档、教程等方面更加完善。

总的来说**，Vue 更适合开发小型到中型的项目，因为 Vue 的学习曲线较低，集成度高，开发效率高；而 React 更适合开发大型、复杂的项目，因为 React 的性能更好，可扩展性更强。**

## **什么是MVC MVVM**

### MVC

MVC模式将一个应用程序分成三个部分：**模型（Model），视图（View）和控制器**（Controller）。

其中**模型表示数据和业务逻辑，视图表示用户界面，控制器则协调模型和视图之间的交互**。

MVC模式**将应用程序的不同部分分离开来**，使得代码更加模块化和易于维护。

### MVVM

MVVM模式是一种基于MVC模式的**前端架构设计模式**，

它将**视图（View）和模型（Model）**之间**的数据绑定（data binding）交给了一个名为ViewModel的中间层**，ViewModel会将模型数据转换成视图模型（ViewModel）数据，**然后再将视图模型（ViewModel）数据传递给视图进行渲染**。

MVVM模式可以实现双向绑定，即视图的变化会自动反映到模型中，而模型的变化也会自动反映到视图中。

### 对比

相对于MVC模式，MVVM模式将控制器（Controller）替换成了ViewModel，**减少了控制器（Controller）与视图（View）之间的耦合，使得代码更加简洁、易于维护。**

## JSX 是什么

- JSX 是一**个`JavaScript`的语法扩展，JSX 可以很好地描述 UI 应该呈现出它应有交互的本**质形式

- *17 babel 转换使用 { runtime: "classic" } 转换成  React.createElement(标签,属性,children)*

- 18  babel 转换使用 { runtime: "automatic" } 转换成下面结果，把children抽离出去了

  JSX 的特点包括：

  1. 语法类似于 HTML，易于理解和书写，同时也能很好地表达组件之间的嵌套关系。
  2. 具有表达式的能力，可以在 JSX 中使用 JavaScript 表达式，例如变量、函数调用等。
  3. 支持使用大括号 {} 插入 JavaScript 表达式，使得我们可以动态地渲染组件，增强了组件的灵活性和可复用性。
  4. 允许在 JSX 中使用自定义组件，方便了组件的拆分和重用。
  5. JSX 的代码可读性高，有助于代码的维护和协作。

## Fiber

1. Scheduler（调度器）：调度任务的优先级，高优任务优先进入 Reconciler
2. Reconciler（协调器）：负责找出变化的组件（使用 `Fiber` 重构）
3. Renderer（渲染器）：负责将变化的组件渲染到页面上

Fiber 架构是 React 在 16 版本中引入的一种新的协调算法，用于组件更新过程的调度和执行。传统的协调算法是递归式的，会阻塞浏览器主线程，导致性能问题。Fiber 架构通过将更新任务拆分成一个个小任务，将其分散在多个帧中完成，从而使得浏览器主线程不被长时间占用，提高了应用的响应能力。

在 Fiber 架构中，React 应用程序的组件树被映射为一个 fiber 树，每个 fiber 对象代表着组件树中的一个组件或者一个 DOM 节点，保存了组件状态、属性和组件对应的 DOM 节点等信息。在更新过程中，React 会通过遍历 fiber 树来找到需要更新的 fiber 对象，通过对 fiber 对象的状态进行修改，实现组件的更新。

Fiber 架构的调度过程通过 requestIdleCallback API 实现，浏览器会在空闲时间执行 React 的任务调度，将 fiber 树中需要更新的任务分解成多个小任务，在多个帧中完成，从而不会阻塞浏览器主线程。

Fiber 架构的引入使得 React 应用程序在性能上得到了很大的提升，同时也为 React 未来的发展提供了更多的可能性。

![image-20230328112620514](C:\Users\哗啦啦\AppData\Roaming\Typora\typora-user-images\image-20230328112620514.png)

#### 性能瓶颈

- JS 任务执行时间过长
  - 浏览器刷新频率为 60Hz,大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6ms 的话，就会导致掉帧，导致卡顿，解决方案就是 React 利用空闲的时间进行更新，不影响渲染进行的渲染
  - 把一个耗时任务切分成一个个小任务，分布在每一帧里的方式就叫时间切片

####  屏幕刷新率

- 目前大多数设备的屏幕刷新率为 60 次/秒
- 浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致
- 页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的,小于这个值时，用户会感觉到卡顿
- 每个帧的预算时间是 16.66 毫秒 (1 秒/60)
- 1s 60 帧，所以每一帧分到的时间是 1000/60 ≈ 16 ms,所以我们书写代码时力求不让一帧的工作量超过 16ms

####  帧

- 每个帧的开头包括样式计算、布局和绘制
- JavaScript 执行 Javascript 引擎和页面渲染引擎在同一个渲染线程,GUI 渲染和 Javascript 执行两者是互斥的
- 如果某个任务执行时间过长，浏览器会推迟渲染

![lifeofframe](http://img.zhufengpeixun.cn/lifeofframe.jpg)

####  requestIdleCallback我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互

- `requestIdleCallback` 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应
- 正常帧任务完成后没超过 16 ms,说明时间有富余，此时就会执行 `requestIdleCallback` 里注册的任务

![cooperativescheduling2](http://img.zhufengpeixun.cn/cooperativescheduling2.jpg)

#### 5.5 fiber

- 我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度
- 通过 Fiber 架构，让自己的调和过程变成可被中断。 适时地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互

##### 1.5.5.1 Fiber 是一个执行单元

- Fiber 是一个执行单元,每次执行完一个执行单元, React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去

![fiberflow](http://img.zhufengpeixun.cn/fiberflow.jpg)

#####  Fiber 是一种数据结构

- React 目前的做法是使用链表, 每个虚拟节点内部表示为一个`Fiber`
- 从顶点开始遍历
- 如果有第一个儿子，先遍历第一个儿子
- 如果没有第一个儿子，标志着此节点遍历完成
- 如果有弟弟遍历弟弟
- 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
- 没有父节点遍历结束





## React的初次渲染

1. 通过babel编译将写的html标签转换成jsx函数成成虚拟dom

​		![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141604.png?token=AU2NEGBPTRPKZWQAWSMSER3GZ3AOI)

2. 调用creatRoot方法会创建一个ReactDOMRoot一个实例

```JS
const root = createRoot(document.getElementById("root"))
```

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141640.png?token=AU2NEGBXZQYAHECYZ2ICM4DGZ3AQS)

3. 调用root的render方法先把element虚拟dom放到HostRootFiber的更新队列中

   - 这是一个循环链表

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141715.png?token=AU2NEGDIJXIP754DS262GGTGZ3ASW)

4. 开始调度更新，初始化栈

5. 开始递归构建fiber树

6. 调用beginWork方法 ，目标是根据新虚拟DOM构建新的fiber子链表 child .sibling

   1. renderRootSync(root)同步构建fiber树

      workInProgress = createWorkInProgress(root.current, null)

   2. 创建一个 root.current对应的workInProgress

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141930.png?token=AU2NEGBWOQRXOMZ6BS3VHD3GZ3A3G)

   3. 递归构建子节点workLoopSync() 执行工作单元  一个fiber就是一个工作单元

      ```js
      function workLoopSync() {
      while (workInProgress !== null) {
         performUnitOfWork(workInProgress)
      }
      }
      ```

   4. 处理节点，将fiber中的updataQuene放的虚拟dom取出来放到memoizedState上
      workInProgress.memoizedState={ element }

   5. reconcileChildren协调子节点 diff算法，看看有没有老fiber 有的话就是diff算法update 没有的话就是mount

      - 根fiber，走updata，用我新的element和老的fiber的子fiber进行比较 和创建
      - 没有老fiber的 创建子fiber链表并让第一个子fiber指向父fiber

   6. 根据虚拟DOM创建新的Fiber节点,并且让新创建的fiber的return指向父fiber，给fiber上面添加副作用Placement

   7. const next = beginWork(current, unitOfWork) //返回新创建的第一个子fiber

   ​	看有没有子fiber节点，话 workInProgress = next

   8. 回头执行第三步 

7. completeUnitOfWork(unitOfWork)完成工作单元

   > 执行一个fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
   >
   > 给fiber.stateNode, fiber.fibersubtreeFlags fiber.flags赋值

   ![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img20240828141900.png?token=AU2NEGG3X2COZLV43K7XAGTGZ3AZM)

8. commitRoot(root) 开始进入提交 阶段，就是执行副作用，修改真实DOM







##  React 的并发渲染

React 的并发渲染（Concurrent Rendering）是 React 提供的一种高级渲染模式，旨在使 React 应用更具响应性和可交互性。它允许 React 打断长时间运行的渲染任务，并优先处理更紧急的更新任务，比如用户输入，从而提升应用的响应速度和用户体验。

### 关键概念

1. **时间分片（Time Slicing）**：
   - 并发渲染通过将渲染工作分成多个小块，并在每一帧中完成一部分渲染工作。这样，React 可以在处理渲染任务的同时，也能响应用户输入和其他高优先级的事件。
2. **优先级调度（Priority Scheduling）**：
   - React 并发模式下，可以根据不同的更新类型分配不同的优先级。高优先级的任务（如用户输入）会比低优先级的任务（如数据加载后的渲染）更早地得到处理。
3. **中断和恢复（Interruptible Rendering）**：
   - 在并发模式中，React 的渲染工作可以被中断，允许更高优先级的任务先行处理。渲染任务可以在之后的空闲时间点继续完成。

### 并发渲染的优势

- **提升用户体验**：通过优先处理高优先级任务，使用户操作更加流畅。
- **避免页面卡顿**：将大任务分割成小任务，避免一次性大量渲染导致页面卡顿。
- **更好的资源利用**：充分利用浏览器的空闲时间进行渲染。





## DIFF算法

React 的 diff 算法是 React 在更新 DOM 时使用的算法。它的目的是最小化页面的重新渲染，以便提高性能。

当 React 渲染组件时，它会在内存中生成虚拟 DOM 树。然后，它会对比新的虚拟 DOM 树和之前的树的差异，找出最小的变化集合。这些变化会被打包成一组操作，用来更新真正的 DOM。

React 的 diff 算法遵循以下规则：

- 同级比较：React 会把新的虚拟 DOM 树中的每一个节点与之前的树中的节点进行比较。如果节点类型不同或者属性不同，React 会直接替换掉原来的节点。如果节点类型相同，React 会继续递归比较这两个节点的子节点。

- 先序深度优先搜索：React 会按照节点的先序深度优先搜索的顺序，对比新旧两棵虚拟 DOM 树。这意味着，如果节点 A 在虚拟 DOM 中出现在节点 B 之前，那么在比较过程中，A 也会先于 B 被比较。

  在比较同级节点时，React 会尽可能多地保留原来的节点。如果新的虚拟 DOM 中有多余的节点，它会把多余的节点插入到相应的位置；如果新的虚拟 DOM 中少了某些节点，它会把多余的节点删除。

  在比较过程中，React 会把节点分成四类：新增、删除、修改、移动。对于新增、删除、修改的节点，React 会直接在 DOM 中进行对应的操作。对于移动的节点，React 会先将节点从原来的位置删除，然后再将节点插入到新的位置。

  

  

  

### 单节点

![image-20230723100621987](/Users/dxm/Library/Application Support/typora-user-images/image-20230723100621987.png)

### 多节点的 diff

- DOM DIFF 的三个规则
  - 只对同级元素进行比较，不同层级不对比
  - 不同的类型对应不同的元素
  - 可以通过 key 来标识同一个节点
- 第 1 轮遍历
  - 如果 key 不同则直接结束本轮循环
  - newChildren 或 oldFiber 遍历完，结束本轮循环
  - key 相同而 type 不同，标记老的 oldFiber 为删除，继续循环
  - key 相同而 type 也相同，则可以复用老节 oldFiber 节点，继续循环
- 第 2 轮遍历
  - newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
  - oldFiber 遍历完了，而 newChildren 还有，将剩下的 newChildren 标记为插入，DIFF 结束
  - newChildren 和 oldFiber 都同时遍历完成，diff 结束
  - newChildren 和 oldFiber 都没有完成，则进行`节点移动`的逻辑
- 第 3 轮遍历
  - 处理节点移动的情况



## 事件机制

![image-20240828222549839](/Users/dxm/Library/Application Support/typora-user-images/image-20240828222549839.png)





> 合成事件是围绕浏览器原生事件充当跨浏览器包装器的对象,它们将不同浏览器的行为合并为一个 API,这样做是为了确保事件在不同浏览器中显示一致的属性

> 事件都绑定到了 `div#root` 上 可以大量节省内存占用，减少事件注册,当新增子对象时无需再次对其绑定

### 底层实现原理

- 通过插件系统注册事件名
- 给`div#root`绑定事件
  - 遍历所有的原生的事件比如click,进行监听
  - 生成dispatchEvent函数，绑定两个阶段的事件
- 派发事件冒泡和捕获（点击事件源）
  - 获取事件源，拿到真实DOM和对应的fiber
  - 从事件源向上递遍历fiber，将对应事件映射的函数添加到 listeners
  - 创建合成事件实例，兼容处理
  - 将对应的合成事件和函数添加到 dispatchQueue
- 区分冒泡和捕获 执行对应的回调函数

白话文：



### 其他

**合成事件**

- 合成事件是围绕浏览器原生事件充当跨浏览器包装器的对象,它们将不同浏览器的行为合并为一个 API,这样做是为了确保事件在不同浏览器中显示一致的属性 ，
- event 重写preventDefault 和stopPropagation等做兼容处理

**事件代理**

- 事件代理又称之为事件委托
- 事件代理是把原本需要绑定在子元素的事件委托给父元素，让父元素负责事件监听
- 事件代理是利用事件冒泡来实现的



## Hooks

### **useCallback**

`useCallback` 的作用是**缓存一个函数，**避免在每次渲染时都创建新的函数，减少子组件重复渲染的次数。

它接收两个参数：回调函数和一个依赖数组。只有当依赖数组中的变量发生变化时，才会重新创建新的函数并返回。



举个例子，假设有一个父组件，内部包含一个子组件**，父组件传递给子组件一个回调函数** `handleClick`，子组件内部通过 `props.handleClick()` 触发该函数。如果 `handleClick` 每次都是新的函数，子组件在比对 `props` 的时候就会重新渲染，影响性能。这时候我们可以使用 `useCallback` 缓存 `handleClick` 函数，避免不必要的子组件重复渲染。

### useMemo

`useMemo` 的作用是**缓存一个值**，避免在每次渲染时都重新计算，同样是为了减少子组件重复渲染的次数。

它接收两个参数：计算函数和一个依赖数组。只有当依赖数组中的变量发生变化时，才会重新计算新的值并返回。

举个例子，假设有一个父组件，内部需要显示一个计算结果，计算的过程需要耗费一些时间，如果每次渲染都要重新计算，会影响页面性能。这时候我们可以使用 `useMemo` 缓存计算结果，避免不必要的计算。

综上所述，`useCallback` 和 `useMemo` 都是**为了优化性能，前者优化函数，后者优化值，区别在于返回值不同。**

![image-20230328112259714](C:\Users\哗啦啦\AppData\Roaming\Typora\typora-user-images\image-20230328112259714.png)

![image-20230328112647644](C:\Users\哗啦啦\AppData\Roaming\Typora\typora-user-images\image-20230328112647644.png)

## 实现

### jsx

```js
const { hasOwnProperty } = Object.prototype
const REACT_ELEMENT_TYPE = Symbol.for("react.element")
//保留的属性，不会放在props上
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
}

function hasValidRef(config) {
  return config.ref !== undefined
}

function ReactElement(type, key, ref, props) {
  return {
    //这就是React元素，也被称为虚拟DOM
    $$typeof: REACT_ELEMENT_TYPE,
    type, //h1 span
    key, //唯一标识
    ref, //后面再讲，是用来获取真实DOM元素
    props, //属性 children,style,id
  }
}
//React17以前老版的转换函数中key 是放在config里的,第三个参数放children
//React17之后新版的转换函数中key是在第三个参数中的，children是放在config里的
export function jsxDEV(type, config, maybeKey) {
  let propName //属性名
  const props = {} //属性对象
  let key = null //每个虚拟DOM可以有一个可选的key属性，用来区分一个父节点下的不同子节点
  let ref = null //引入，后面可以通过这实现获取真实DOM的需求
  if (typeof maybeKey !== "undefined") {
    key = maybeKey
  }

  if (hasValidRef(config)) {
    ref = config.ref
  }
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName]
    }
  }
  return ReactElement(type, key, ref, props)
}
```

### useRffect hook

```js
let effects = [] // 定义副作用数组
let idx = 0 // 定义副作用索引

function useEffect(callback, dependencies) {
  // 如果没有指定依赖项，则默认为全部依赖
  const dependenciesArr = dependencies || [true]

  // 如果当前索引为空，则添加新的副作用
  if (!effects[idx]) {
    effects[idx] = {
      dependencies: dependenciesArr,
      cleanup: undefined,
    }
  }

  // 检查依赖项是否有任何更改
  const dependenciesChanged = effects[idx].dependencies.some(
    (dep, i) => dep !== dependenciesArr[i]
  )

  // 如果依赖项有更改，则运行清理函数并重新设置副作用
  if (dependenciesChanged && effects[idx].cleanup) {
    effects[idx].cleanup()
    effects[idx] = {
      dependencies: dependenciesArr,
      cleanup: callback(),
    }
  }

  // 如果依赖项没有更改，则什么都不做
  effects[idx].dependencies = dependenciesArr
  idx++
}

function render() {
  idx = 0 // 重置副作用索引

  // 渲染组件
}
```

### useState

```js
let state // 定义状态变量

function useState(initialValue) {
  state = state || initialValue // 初始化状态变量

  function setState(newState) {
    state = newState // 更新状态变量
    render() // 重新渲染组件
  }

  return [state, setState] // 返回状态和更新函数
}
```


