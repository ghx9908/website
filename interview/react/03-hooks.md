---
title: 3. hooks
last_update:
  date: 12/20/2022
  author: 高红翔
---

## React Hooks 当中的 useEffect 是如何区分生命周期钩子的？

useEffect 可以看成是 componentDidMount、componentDidUpdate 和 componentWillUnmount 三者的结合

useEffect(callback，[source])接受两个参数，调用方式如下：

```
useEffect(() => {
  consoloe.log("mounted");
  return () => {
    console.log("willUnmount");
  };
}, [source]);
```

生命周期函数的调用主要是通过第二个参数`[source]`来进行控制，有如下几种情况：

- `[source]参数不传时`，则每次都会优先调用上次保存的函数中返回的那个函数，然后在调用外部那个函数
- `[source]参数传[]时`，则外部的函数只会在初始化时调用一次，返回的那个函数也只会最终在组件卸载时调用一次
- `[source]参数有值时`，则只会监听到数组中的值发生变化后才优先调用返回的那个函数，在调用外部的函数
