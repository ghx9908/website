---
title: 10.PromisesA+规范
last_update:
  date: 02/14/2023
  author: 高红翔
---

# Promises/A+

## 概念

### Promise States

一个 promise 必须处于以下三种状态之一：`pending`（待定）、`fulfilled`（已解决）或 `rejected`（已拒绝）。

- 当 promise 处于 `pending` 状态时：
  - 可以转换为 `fulfilled` 或 `rejected` 状态。
- 当 promise 处于 `fulfilled` 状态时：
  - 不得转换为其他状态。
  - 必须有一个值，并且该值不能改变。
- 当 promise 处于 `rejected` 状态时：
  - 不得转换为其他状态。
  - 必须有一个原因，并且该原因不能改变。

### The `then` Method

Promise 必须提供一个 `then` 方法来访问它当前或将来的值或原因。

Promise 的 `then` 方法接受两个参数：

```js
promise.then(onFulfilled, onRejected);
```

- `onFulfilled` 和 `onRejected` 都是可选参数：

  - 如果 `onFulfilled` 不是一个函数，它必须被忽略。
  - 如果 `onRejected` 不是一个函数，它必须被忽略。

- 如果 `onFulfilled` 是一个函数：

  - 它必须在 promise 被解决（fulfilled）后调用，并将 promise 的值作为它的第一个参数。
  - 它不能在 promise 被解决之前调用。
  - 它不能被调用多次。

- 如果 `onRejected` 是一个函数：

  - 它必须在 promise 被拒绝（rejected）后调用，并将 promise 的原因作为它的第一个参数。
  - 它不能在 promise 被拒绝之前调用。
  - 它不能被调用多次。

- `onFulfilled` 或 `onRejected` 不应被调用，直到执行上下文栈中只包含平台代码。[3.1]

- `onFulfilled` 和 `onRejected` 必须作为函数调用（即没有绑定 `this` 值）。[3.2]

- `then` 可以在同一个 promise 上多次调用。

  - 当 promise 被解决时，所有相关的 `onFulfilled` 回调必须按照它们最初调用 `then` 的顺序执行。
  - 当 promise 被拒绝时，所有相关的 `onRejected` 回调必须按照它们最初调用 `then` 的顺序执行。

- `then` 必须返回一个 promise

  ```
  promise2 = promise1.then(onFulfilled, onRejected);
  ```

  - 如果 `onFulfilled` 或 `onRejected` 返回一个值 `x`，则执行 Promise 解析过程 `[[Resolve]](promise2, x)`。
  - 如果 `onFulfilled` 或 `onRejected` 抛出异常 `e`，`promise2` 必须以 `e` 作为原因被拒绝。
  - 如果 `onFulfilled` 不是一个函数，并且 `promise1` 已经解决（fulfilled），则 `promise2` 必须以与 `promise1` 相同的值被解决。
  - 如果 `onRejected` 不是一个函数，并且 `promise1` 已经被拒绝（rejected），则 `promise2` 必须以与 `promise1` 相同的原因被拒绝。

### The Promise Resolution Procedure

Promise 解析过程是一个抽象操作，它接受一个 promise 和一个值作为输入，我们将其表示为 `[[Resolve]](promise, x)`。如果 `x` 是一个 thenable 对象，它会尝试让 `promise` 采用 `x` 的状态，假设 `x` 至少在某种程度上表现得像一个 promise。否则，它将使用值 `x` 来完成 `promise`。

要运行 `[[Resolve]](promise, x)`，执行以下步骤：

1. 如果 `promise` 和 `x` 指向同一个对象，则以 TypeError 作为原因拒绝 `promise`。

2. 如果 `x`是一个 promise，采用它的状态:

   - 如果 `x` 处于待定（pending）状态，则 `promise` 必须保持待定状态，直到 `x` 被解决（fulfilled）或拒绝（rejected）。
   - 如果/当 `x` 被解决时，用相同的值解决 `promise`。
   - 如果/当 `x` 被拒绝时，用相同的原因拒绝 `promise`。

3. 否则，如果 `x` 是一个对象或函数：

   - 取 `x.then` 的值
   - 如果获取 `x.then` 属性时抛出异常 `e`，用 `e` 作为原因拒绝 `promise`
   - 如果 `then` 是一个函数，用 `x` 作为 `this`，以 `resolvePromise` 作为第一个参数，`rejectPromise` 作为第二个参数来调用它：

     - 如果/当 `resolvePromise` 被调用并传入一个值 `y`，运行 `[[Resolve]](promise, y)`。
     - 如果/当 `rejectPromise` 被调用并传入一个原因 `r`，用 `r` 拒绝 `promise`。
     - 如果 `resolvePromise` 和 `rejectPromise` 都被调用，或对同一个参数进行多次调用，则第一次调用优先，后续调用将被忽略。

   - 如果调用 `then` 抛出异常 `e`
     - 如果 `resolvePromise` 或 `rejectPromise` 已被调用，则忽略它。
     - 否则，用 `e` 作为原因拒绝 `promise`。
   - 如果 `then` 不是一个函数，使用 `x` 作为`promise` 成功的`value`

4. 如果 `x` 不是一个对象或函数，使用 `x` 作为`promise` 成功的`value`

## 源码实现

```js
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function promiseResolve(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  if (x instanceof Promise) {
    x.then(resolve, reject);
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let then;
    let called = false;
    try {
      then = x.then;
    } catch (e) {
      if (called) return;
      called = true;
      return reject(e);
    }
    if (typeof then === "function") {
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            setTimeout(() => {
              promiseResolve(promise, y, resolve, reject);
            });
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      if (called) return;
      called = true;
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];
    const resolve = (value) => {
      if (value instanceof Promise) {
        // 递归解析的流程
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onFulfilledCallback.forEach((callback) => callback());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallback.forEach((callback) => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  static deferred() {
    var result = {};
    result.promise = new MyPromise(function (resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    });

    return result;
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            promiseResolve(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            promiseResolve(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.status === PENDING) {
        this.onFulfilledCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              promiseResolve(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);

              promiseResolve(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }
}
module.exports = MyPromise;
```
