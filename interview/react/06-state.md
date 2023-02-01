---
title: setState
last_update:
  date: 12/20/2022
  author: 高红翔
---

## React 中，能否直接将 props 的值复制给 state?

应该避免这种写法：

```
constructor(props){
    super(props);
    // 不要这样做
    this.state={color:props.color}
}
```

因为这样做毫无必要(可以直接使用 this.props.color)，同时还产生了 bug(更新 prop 中的 color 时，并不会影响 state)。只有在你刻意忽略 prop 更新的情况下使用。此时，应将 prop 重命名为 initialColor 或 defaultColor。必要时，你可以修改它的 key，以强制重置其内部 state。

```jsx
一般情况下，子组件接收到父组件传来的props，当做变量直接用就可以，但是个别情况下子组件需要将props赋值给state。一开始，按照常规写法

class Child extends React.Component {
　　constructor(props) {
　　　　super(props)
　　　　　　this.state = {
　　　　　　　　list: props.list
　　　　　　}
　　　　}
}
会发现，页面会重新渲染，但是页面数据并没有变化。
---------------------------
当父组件更新导致子组件更新时，子组件的生命周期执行顺序是
componentWillReceiveProps --> shouldComponentUpdate --> componentWillUpdate --> render --> componentDidUpdate
也就是说子组件刷新的时候，不再执行constructor，当然也就不会对state重新赋值，所以子组件虽然执行了render，但是渲染数据不变。
所以要解决此问题也并不难，就是在componentWillReceiveProps中重新对state赋值，即可。

componentWillReceiveProps(props) {
　　this.setState({
　　　　list: props.list
　　})
}
```
