---
title: 实现虚拟 DOM（jsxDEV 的实现）
last_update:
  date: 11/15/2022
  author: 高红翔
---

## 实现

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

## 转换图

![img](https://static.zhufengpeixun.com/virutaldom_1664073330011.jpg)

![img](https://static.zhufengpeixun.com/virutaldom_1664037444732.png)

###
