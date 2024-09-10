---
sidebar_position: 3
title: js面试题
---

## 事件循环机制

关键词：

#### 1. **宏任务（Macro Task）和微任务（Micro Task）**

在 JavaScript 的事件循环中，任务可以分为两类：宏任务和微任务。

- **宏任务（Macro Task）**：通常包括 `setTimeout`、`setInterval`、I/O 操作、UI 渲染、事件回调等。宏任务队列中的任务是按先入先出的顺序执行的。
- **微任务（Micro Task）**：通常包括 `Promise` 的回调、`process.nextTick`（Node.js 特有）、MutationObserver 回调等。微任务队列中的任务在每个宏任务执行完之后立即执行，并且优先级高于宏任务。

#### 2. **事件循环的详细步骤**

1. **执行一个宏任务**（如果存在的话，通常是从任务队列中取出并执行）。
1. **执行所有的微任务**（一次性执行所有的微任务）。
1. **更新渲染**（如果需要的话，通常是在浏览器环境下进行渲染更新）。
1. **重复以上步骤**。

#### 3.应用 **React 中的事件循环**

在 React 中，特别是 React 18 之后，引入了并发模式（Concurrent Mode）。并发模式可以使得 React 更高效地处理复杂的 UI 更新。

- **Concurrent Mode**：React 使用优先级调度（基于时间分片和微任务机制）来优化 UI 渲染。React 会打断低优先级的渲染任务来及时处理高优先级的任务（如用户输入）。

#### 4. **Node.js 中的事件循环**

Node.js 的事件循环实现基于 `libuv` 库，它的事件循环和浏览器中的事件循环有所不同，包含了更多的阶段：

1. **Timers**：执行 `setTimeout` 和 `setInterval` 的回调。
2. **I/O callbacks**：处理一些延迟的 I/O 回调。
3. **Idle, prepare**：仅限内部使用。
4. **Poll**：检索新的 I/O 事件；执行 I/O 相关回调。
5. **Check**：执行 `setImmediate` 的回调。
6. **Close callbacks**：关闭回调，如 `socket.on('close', ...)`。

## Reflect.ownKeys 与 Object.keys 的区别

- 两者得到的都是对象属性的集合，以数组形式返回

- Object.keys()得出的对象的可枚举属性，并且不包括原型上的属性和 Symbol 的属性

- Reflect.ownKeys()得出的对象自己的所有属性，包括不可枚举和 Symbol 的属性，但是拿不到原型上的属性

```js
Object.prototype.pr = "我是原型属性";
let s = Symbol();
let obj = {
  [s]: "this is Symbol",
  a: "a",
};
Object.defineProperty(obj, "name", {
  value: "sunny",
  configurable: true,
  enumerable: false,
  writable: true,
});

console.log("Object.keys", Object.keys(obj)); // ["a"]
console.log("Reflect.ownKeys(obj)", Reflect.ownKeys(obj)); //["a", "name", Symbol()]
```

## 继承

### 一、原型链继承

**构造函数、原型和实例的关系：** 每个构造函数都有一个原型对象，原型有一个属性指回构造函数，而实例有一个内部指针指向原型。

**原型链的基本构想：** 如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链

**重点：** 让新实例的原型等于父类的实例。

```js
function SuperType() {
  this.property = true;
}
SuperType.prototype.getSuperValue = function () {
  return this.property;
};
function SubType() {
  this.subproperty = false;
}
// 继承 SuperType
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
  return this.subproperty;
};
let instance = new SubType();
console.log(instance.getSuperValue()); // true
```

**特点：**

1. 实例可继承的属性有：实例的构造函数的属性，父类构造函数属性，父类原型的属性。

**缺点：**

1. 新实例无法向父类构造函数传参。
2. 继承单一。(只能继承一个父类构造函数)
3. 所有新实例都会共享父类实例的属性。（原型上的属性是共享的，一个实例修改了原型属性，另一个实例的原性也会被修改！）
4. 要想为子类原型新增属性和方法，必须要在`new SuperType()`这样的语句之后执行

代码如下：

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
function SubType() {}
// 继承 SuperType
SubType.prototype = new SuperType();
let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
let instance2 = new SubType();
console.log(instance2.colors); // "red,blue,green,black"
```

### 二、借用构造函数继承

**重点：** 用.call()和.apply()将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））

```js
function SuperType(name) {
  this.name = name;
}
function SubType() {
  // 继承 SuperType 并传参
  SuperType.call(this, "Nicholas");
  // 实例属性
  this.age = 29;
}
let instance = new SubType();
console.log(instance.name); // "Nicholas";
console.log(instance.age); // 29
```

**特点：**

1. 只继承了父类构造函数的属性，没有继承父类原型的属性。
2. 解决了原型链继承缺点 1、2、3。
3. 可以继承多个构造函数属性（call 多个）。
4. 在子实例中可向父实例传参。
5. 解决了引用值问题

**缺点：**

1. 只能继承父类构造函数的属性。
2. 无法实现构造函数的复用。
3. 每个新实例都有父类构造函数的副本，臃肿。

### 三、组合继承（组合原型链继承和借用构造函数继承）（常用）

**重点：** 结合了两种模式的优点，**传参和复用**

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name); //// 第一次调用 SuperType()
  this.age = age;
}
// 继承方法
SubType.prototype = new SuperType(); // 第二次调用 SuperType()
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
let instance1 = new SubType("Nicholas", 29);
console.log("instance1=>", instance1);
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // "Nicholas";
instance1.sayAge(); // 29
let instance2 = new SubType("Greg", 27);
console.log(instance2.colors); // "red,blue,green"
instance2.sayName(); // "Greg";
instance2.sayAge(); // 27
```

**特点：**

1. 可以继承父类原型上的属性，可以传参，可复用。
2. 每个新实例引入的构造函数属性是私有的。

**缺点：** 组合继承其实也存在效率问题。最主要的效率问题就是 **父类构造函数始终会被调用两次** ：一次在是创建子类原型时调用，另一次是在子类构造函数中调用

### 四、原型式继承

**重点：** 用一个函数包装一个对象，然后返回这个函数的调用，这个函数就变成了个可以随意增添属性的实例或对象。object.create()就是这个原理。

```js
//核心代码
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};
let anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
let yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"
```

**特点：** 类似于复制一个对象，用函数来包装。

**缺点：**

1. 所有实例都会继承原型上的属性。

2. 无法实现复用。（新实例属性都是后面添加的）

> 原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。但要记住，属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的

### 五、寄生式继承

**重点：** 就是给原型式继承外面套了个壳子。

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function createAnother(original) {
  let clone = object(original); // 通过调用函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式增强这个对象
    console.log("hi");
  };
  return clone; // 返回这个对象
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};
let anotherPerson = createAnother(person);
anotherPerson.sayHi(); // "hi"
//寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。object()函数不是寄生式继承所必需的，任何返回新对象的函数都可以在这里使用。
// 注意 通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似。
```

**优点：** 没有创建自定义类型，因为只是套了个壳子返回对象（这个），这个函数顺理成章就成了创建的新对象。

**缺点：** 没用到原型，无法复用。

### 六、寄生组合式继承（常用）

**重点：** 通过**借用构造函数继承属性** ，但使用混合式原型链继承方法。基本思路是不通过调用父类构造函数给子类原型赋值，而是取得父类原型的一个副本。说到底就是使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型。

**寄生：** 在函数内返回对象然后调用

**组合：**

1. 函数的原型等于另一个实例。
2. 在函数中用 apply 或者 call 引入另一个构造函数，可传参

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

/*function inheritPrototype(subType, superType) { 
 let prototype = object(superType.prototype); // 创建对象
 prototype.constructor = subType; // 增强对象 
 subType.prototype = prototype; // 赋值对象
}*/

function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
let prototype = object(superType.prototype); // 创建对象
subType.prototype = prototype; // 赋值对象
prototype.constructor = subType; // 修复实例

//inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

**优先：** 修复了组合继承的问题

**缺点：** 实现麻烦

## 输出题

### 题目 1

#### 考察点

- 函数和作用域的优先级
- new 在执行时的一些机制
- 函数和变量声明的顺序与优先级

#### **题目**

```js
function Foo() {
  getName = function () {
    console.log("11=>", 11);
  };
  return this;
}
Foo.getName = function () {
  console.log("22=>", 22);
};
Foo.prototype.getName = function () {
  console.log("33=>", 33);
};
var getName = function () {
  console.log("44=>", 44);
};
function getName() {
  console.log("55=>", 55);
}

Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();

// 22=> 22
// 44=> 44
// 11=> 11
// 11=> 11
// 22=> 22
// 33=> 33
// 33=> 33
```

#### 分析

1. Foo.getName() 调用的是 Foo 上的静态方法,输出 22。
2. 第一次调用 getName() 输出 44,调用的是全局作用域下声明的 getName 变量函数。
3. Foo().getName() 输出 11,Foo() 构造函数内部声明的 getName 变量,优先级最高。
4. 第二次调用 getName() 输出 11,因为被 Foo() 内的 getName 覆盖了。
5. new Foo.getName() 输出 22,new 执行的是 Foo 上的静态方法。
6. new Foo().getName() 输出 33,new Foo() 创建了一个实例,调用的是原型上的方法。
7. new new Foo().getName() 也输出 33,新的语法并没有改变其机制,仍然执行原型上的方法。

#### 收获

1. 远算优先级

- 分组（...）19
- 成员访问（a.b） ，new（带参数了；列表），函数调用，可选链 优先级较高 为 18
- new（无参数列表） 17
- 后置递增 /递减 16
- 赋值 （从右到左） 2

2. new 关键字会进行如下的操作：

- 创建一个空的简单 JavaScript 对象（即 {}）；
- 为步骤 1 新创建的对象添加属性 **proto**，将该属性链接至构造函数的原型对象；
- 将步骤 1 新创建的对象作为 this 的上下文；
- 如果该函数没有返回对象，则返回 this。

3. `.`和`new`的优先级

- . 当 new 和 . 同时出现时,new 的优先级更高,例如:
  new Foo().getName()
  这里 new Foo()会先执行。
- 当 . 在 new 的参数位置时,. 的优先级更高,例如:
  new Foo.getName()
  这里 Foo.getName 会先解析。
- 当 . 不在 new 的参数位置时,new 的优先级更高。

这么设定优先级主要基于以下考虑:

- new 作为创建实例的运算符,应该先执行。
- . 在 new 的参数位置时,要先解析出一个静态方法。
- . 不在参数位置时,应该作用于 new 创建的实例上。
