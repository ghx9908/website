---
title: 解析 URL Params 为对象
last_update:
  date: 12/20/2022
  author: 高红翔
---

## 题目

```js
let url =
  "http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled"
parseParam(url)
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/
```

```js
//qs 库
var qs = require("qs")

const { parse } = qs

console.log(
  parse("user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled")
)
console.log(parse("a=1&b=&c=5&f=hello"))
console.log(parse("a&b&c"))
console.log(parse("a[name]=fox&a[company]=tecent&b=why"))
console.log(parse("color=Deep%20Blue"))
console.log(parse("a[0]=1&a[1]=2"))
// { user: 'anonymous', id: [ '123', '456' ], city: '北京', enabled: '' }
// { a: '1', b: '', c: '5', f: 'hello' }
// { a: '', b: '', c: '' }
// { a: { name: 'fox', company: 'tecent' }, b: 'why' }
// { color: 'Deep Blue' }
// { a: [ '1', '2' ] }
```

### 简单解法

```js
function querySearch(url) {
  const query = url.split("?").pop().split("#").shift().split("&")
  const res = {}
  query.forEach((item) => {
    const [key, val] = item.split("=")
    res[key] = val
  })
  return res
}
console.log(
  querySearch("user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled")
)
console.log(querySearch("a=1&b=&c=5&f=hello"))
console.log(querySearch("a&b&c"))
console.log(querySearch("a[name]=fox&a[company]=tecent&b=why"))
console.log(querySearch("color=Deep%20Blue"))
console.log(querySearch("a[0]=1&a[1]=2"))
// {
//   user: 'anonymous',
//   id: '456',
//   city: '%E5%8C%97%E4%BA%AC',
//   enabled: undefined
// }
// { a: '1', b: '', c: '5', f: 'hello' }
// { a: undefined, b: undefined, c: undefined }
// { 'a[name]': 'fox', 'a[company]': 'tecent', b: 'why' }
// { color: 'Deep%20Blue' }
// { 'a[0]': '1', 'a[1]': '2' }
```

### 升级版

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1] // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&") // 将字符串以 & 分割后存到数组中
  let paramsObj = {}
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("=") // 分割 key 和 value
      val = decodeURIComponent(val) // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true
    }
  })

  return paramsObj
}
console.log(
  parseParam("user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled")
)
console.log(parseParam("a=1&b=&c=5&f=hello"))
console.log(parseParam("a&b&c"))
console.log(parseParam("a[name]=fox&a[company]=tecent&b=why"))
console.log(parseParam("color=Deep%20Blue"))
console.log(parseParam("a[0]=1&a[1]=2"))
// { user: 'anonymous', id: [ 123, 456 ], city: '北京', enabled: true }
// { a: 1, b: '', c: 5, f: 'hello' }
// { a: true, b: true, c: true }
// { 'a[name]': 'fox', 'a[company]': 'tecent', b: 'why' }
// { color: 'Deep Blue' }
// { 'a[0]': 1, 'a[1]': 2 }
```

### 完整版

```js
function parse(str) {
  return str.split("&").reduce((o, kv) => {
    const [key, value] = kv.split("=")
    if (!value) {
      o[key] = true
      return o
    }
    deep_set(
      o,
      key.split(/[\[\]]/g).filter((x) => x),
      value
    )
    return o
  }, {})
}

function deep_set(o, path, value) {
  let i = 0
  for (; i < path.length - 1; i++) {
    if (o[path[i]] === undefined) {
      if (path[i + 1].match(/^\d+$/)) {
        o[path[i]] = []
      } else {
        o[path[i]] = {}
      }
    }
    o = o[path[i]]
  }
  value = decodeURIComponent(value)
  value = /^\d+$/.test(value) ? parseFloat(value) : value // 判断是否转为数字
  if (o.hasOwnProperty(path[i])) {
    // 如果对象有 key，则添加一个值
    o[path[i]] = [].concat(o[path[i]], value)
  } else {
    // 如果对象没有这个 key，创建 key 并设置值
    o[path[i]] = value
  }
}
console.log(
  parse("user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled")
)
console.log(parse("a=1&b=&c=5&f=hello"))
console.log(parse("a&b&c"))
console.log(parse("a[name]=fox&a[company]=tecent&b=why"))
console.log(parse("color=Deep%20Blue"))
console.log(parse("a[0]=1&a[1]=2"))
// { user: 'anonymous', id: 456, city: '北京', enabled: true }
// { a: 1, b: true, c: 5, f: 'hello' }
// { a: true, b: true, c: true }
// { a: { name: 'fox', company: 'tecent' }, b: 'why' }
// { color: 'Deep Blue' }
// { a: [ 1, 2 ] }
```
