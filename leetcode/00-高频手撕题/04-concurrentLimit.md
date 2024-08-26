---
title: 4.限制并发
last_update:
  date: 8/26/2024
  author: gaohongxiang
---

```js
function test(id, delay) {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`task${id} has completed`)
        resolve(id)
      }, delay)
    })
  }
}

const tasks = [test(1, 2000), test(2, 1000), test(3, 5000), test(4, 2000), test(5, 1000)]

function concurrentLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0
    let activeCount = 0
    const queue = []
    const taskResult = []

    function handleTask(curTaskIndex) {
      activeCount++
      const result = tasks[curTaskIndex]()

      result
        .then((res) => {
          taskResult[curTaskIndex] = res
        })
        .catch(reject)
        .finally(() => {
          activeCount--
          if (queue.length > 0) {
            handleTask(queue.shift())
          } else if (queue.length === 0 && activeCount === 0) {
            resolve(taskResult)
          }
        })
    }

    // 启动初始的任务
    while (index < tasks.length && index < limit) {
      handleTask(index)
      index++
    }

    // 将剩余的任务加入队列
    for (let i = index; i < tasks.length; i++) {
      queue.push(i)
    }
  })
}

concurrentLimit(tasks, 3).then((result) => {
  console.log("result=>", result)
})
```

## 解析

### 1. 理解基本概念

#### 异步编程和 Promise

在 JavaScript 中，异步编程允许我们执行非阻塞操作，比如网络请求或文件读取。`Promise`是一个用于处理异步操作的对象，它可以是未完成、已完成或已失败的状态。

#### 并发和队列

并发控制意味着我们要限制同时运行的异步操作数量。我们通过队列来管理这些异步操作，确保每次只有指定数量的任务在进行。

### 2. 定义基本结构

我们需要一个函数`concurrentLimit`，它接受两个参数：

- `tasks`：这是一个包含所有异步任务的数组，每个任务都是一个返回`Promise`的函数。
- `limit`：表示同时运行的任务数量。

```javascript
function concurrentLimit(tasks, limit) {
  // 这里我们会编写控制并发的逻辑
}
```

### 3. 创建任务运行逻辑

我们需要一个函数来执行任务，并在任务完成后执行下一个任务。

```javascript
function runTask(taskIndex) {
  // 执行某个任务
}
```

### 4. 管理并发数量

我们可以通过一个计数器`activeCount`来跟踪当前正在运行的任务数量。当任务完成时，计数器减 1，并从队列中取出下一个任务执行。

```javascript
let activeCount = 0

function runTask(taskIndex) {
  if (taskIndex >= tasks.length) return

  activeCount++
  const task = tasks[taskIndex]()

  task
    .then((result) => {
      // 处理结果
    })
    .catch((error) => {
      // 处理错误
    })
    .finally(() => {
      activeCount--
      // 执行下一个任务
    })
}
```

### 5. 控制并发

我们需要在`concurrentLimit`函数中启动初始的任务执行，并管理后续任务的调度。

- [ ] ```javascript
      function concurrentLimit(tasks, limit) {
        return new Promise((resolve, reject) => {
          let index = 0
          let results = []
          const taskQueue = []

          const runTask = (taskIndex) => {
            if (taskIndex >= tasks.length) return
            activeCount++

            const task = tasks[taskIndex]()
            task
              .then((result) => {
                results[taskIndex] = result
              })
              .catch(reject)
              .finally(() => {
                activeCount--
                if (taskQueue.length > 0) {
                  const nextTaskIndex = taskQueue.shift()
                  runTask(nextTaskIndex)
                } else if (activeCount === 0 && index >= tasks.length) {
                  resolve(results)
                }
              })
          }

          // 启动初始任务
          while (index < limit && index < tasks.length) {
            runTask(index)
            index++
          }

          // 将多余的任务放入队列
          for (; index < tasks.length; index++) {
            taskQueue.push(index)
          }
        })
      }
      ```

### 6. 处理所有任务完成的情况

我们要确保当所有任务完成后，`concurrentLimit`函数能够返回所有任务的结果。

### 7. 测试

最后，我们可以编写一些任务来测试这个函数：

```javascript
// 模拟的异步任务
const createTask = (id, delay) => () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Task ${id} completed`)
      resolve(id)
    }, delay)
  })

// 任务列表
const tasks = [createTask(1, 3000), createTask(2, 2000), createTask(3, 1000), createTask(4, 4000), createTask(5, 2000)]

concurrentLimit(tasks, 3).then((results) => {
  console.log("All tasks completed:", results)
})
```

###
