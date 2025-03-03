---
sidebar_position: 3
title: js面试题
---

## 基础

### **类型转换**

- 对象 == 字符串 会把对象转成字符串再比较
- 剩余的都转换为数字进行比较

### a == 1 && a == 2 && a == 3

```js
let a = new Proxy({}, {
    i: 1,
    get() {
        return () => this.i++;
    }
});
if (a == 1 && a == 2 && a == 3) {
    console.log('成功');
}
--------------
var a = {
    count:1,
    toString(){
        return this.count++;
    },
    /* valueOf(){
        return this.count++;
    } */
};
if(a == 1 && a ==2 && a == 3){
  console.log('成功');
}
-----
Object.defineProperty(window,'a',{
    get(){
        return i++;
    }
})
if(a == 1 && a ==2 && a ==3 ){
    console.log('相等');
}

----
var a = [1,2,3];
a.toString = a.shift;
//a.join = a.shift;
if(a == 1 && a ==2 && a ==3 ){
    console.log('相等');
}
```



### +号

- 两个操作数如果是`number`则直接相加出结果
- 如果其中有一个操作数为string，则将另一个操作数隐式的转换为string，然后进行字符串拼接得出结果
- 如果操作数为对象或者是数组这种复杂的数据类型，那么就将两个操作数都转换为字符串，进行拼接
- 如果操作数是像boolean这种的简单数据类型，那么就将操作数转换为number相加得出结果
- `[ ] + { }` 因为[]会被强制转换为"", 然后+运算符 链接一个{ }, { }强制转换为字符串就是"[object Object]"
- { } 当作一个空代码块,+[]是强制将[]转换为number,转换的过程是 +[] => +"" =>0 最终的结果就是0

[]+{}  //"[object Object]"

 {}+[]  //0 

{}+0   //0

 []+0   //"0"



### 真实数组和伪数组有什么区别？

真实数组和伪数组都是 JavaScript 中的数据结构，但它们在使用上有很大的区别。

真实数组是指使用数组字面量或者 Array 构造函数创建的，可以直接使用数组的方法和属性。例如，可以使用 push、pop、splice 等方法对其进行操作。

伪数组是指类似数组的对象，具有数组的某些特性，但却不是真正的数组，例如 arguments 对象、DOM 中的 NodeList 对象等。虽然伪数组可以使用下标访问其中的元素，但是不能使用数组的方法和属性进行操作，因为伪数组不具有 Array.prototype 上的方法和属性。

如果想要将伪数组转换为真实数组，则可以使用 Array.from() 或者展开运算符（...）进行转换。例如，可以使用 Array.from(arguments) 或者 [...document.querySelectorAll('div')] 将伪数组转换为真实数组。

需要注意的是，虽然伪数组不能使用数组的方法和属性进行操作，但是在某些场景下仍然非常有用，例如获取 DOM 中的节点列表或者函数参数的集合。

### 0.1 + 0.2 是否等于 0.3，如何解决？

在JavaScript中，0.1 + 0.2的结果不是0.3，而是0.30000000000000004。这是由于JavaScript采用IEEE 754标准来表示浮点数，采用的是二进制浮点数的表示方法，因此存在精度问题。这个问题可以通过将浮点数转换为整数进行运算，最后再将结果转换为浮点数来解决。可以采用一些库如big.js或decimal.js这样的高精度计算库来解决这个问题。当然，也可以将数字乘以一个足够大的整数（例如10的9次方），进行计算后再除以这个整数，以获得较为准确的结果。





### for...in 和 for of 区别

**for...in**

`for...in` 是用来**遍历对象的属性名称**的语句。它**枚举对象的可枚举属性（包括自身属性和从原型继承的属性**），并将属性名赋值给循环变量。例如：

```js
const obj = { a: 1, b: 2, c: 3 }
for (let key in obj) {
  console.log(key) // 输出：a b c
}
```

注意，`for...in` 的**循环变量是属性名，而不是属性值。**

**for...of**

`for...of` 是用来**遍历可迭代对象（包括数组、Set、Map、字符串等）中的元素的语句**。它将可迭代对象中的元素赋值给循环变量。例如：

```js
const arr = [1, 2, 3]
for (let value of arr) {
  console.log(value) // 输出：1 2 3
}
```

注意，`for...of` 的**循环变量是元素值，而不是索引或属性名。**

###  `map` 和 `forEach`

有个有返回值，一个没有  都不可以打断循环



### filter 和 find 

`filter` 方法返回一个新的数组，其中包含了所有满足条件的元素。如果没有满足条件的元素，返回空数组

`find` 方法返回数组中满足条件的第一个元素。如果没有满足条件的元素，返回 `undefined`

### null 和 undefined 区别

在 JavaScript 中，`null` 和 `undefined` 都代表某种形式的“缺失”，但它们的含义和使用场景有所不同。

- `undefined` 表示一个变量或对象属性没有被赋值，或者一个函数没有返回值。例如：

```js
let x
console.log(x) // 输出：undefined

function foo() {}
console.log(foo()) // 输出：undefined

const obj = { a: 1 }
console.log(obj.b) // 输出：undefined
```

- `null` 表示一个变量或对象属性被明确地赋值为了空值。
- 作为函数的参数，表示该函数的参数不是对象。
- 作为对象原型链的终点
- 它是一个表示“空对象”的特殊值。例如：

```js
let x = null
console.log(x) // 输出：null

const obj = { a: null }
console.log(obj.a) // 输出：null
```

注意：

- `undefined` 是一个原始值，表示“未定义”，而 `null` 是一个特殊的对象值，表示“空对象”。
- 在条件判断中，`null` 和 `undefined` 都被视为 `false`。但是在数值计算中，它们的表现不同：`undefined` 转换为 `NaN`，而 `null` 转换为 `0`。

- 在使用类型严格比较运算符（`===`）时，`null` 只与 `undefined` 相等，而与其他任何值都不相等。

### defineProperty 有什么问题，处理一个对象 a.b.c 是怎么处理的？

`defineProperty` 可以用来定义对象的属性，包括数据属性和访问器属性。但是在使用时需要注意以下几点：

1. 对象的属性必须是已经存在的，无法给对象新增属性。
2. 如果属性是不可配置的，则无法修改该属性的配置，无法重新定义该属性。
3. 在非严格模式下，`defineProperty` 返回值为 `undefined`，在严格模式下，如果定义失败则会抛出一个 `TypeError` 异常。

处理一个对象 `a.b.c` 可以通过以下方式进行：

```js
const a = { b: {} };
Object.defineProperty(a.b, 'c', {
  value: 'Hello World!',
  writable: true,
  enumerable: true,
  configurable: true,
});
```

这里使用了 `Object.defineProperty` 方法来定义 `a.b.c` 这个属性，并设置了属性的 `value`、`writable`、`enumerable` 和 `configurable` 属性。如果需要修改这个属性，则可以通过 `Object.defineProperty` 方法重新定义该属性。



### Proxy 是怎么处理的？

`Proxy` 是 ES6 中新增的一种对象，它允许你在对象的基础上定义一个拦截层（handler），对外界的访问进行拦截和自定义处理。

`Proxy` 对象的创建需要两个参数，第一个参数是需要被代理的对象（target），第二个参数是一个拦截器对象（handler），拦截器对象中定义了各种拦截器函数，可以拦截 target 对象的各种操作，比如属性的读取、设置、删除，方法的调用等等。

与 `Object.defineProperty` 不同，`Proxy` 适用于监听整个对象的变化，并在对象发生变化时对其进行拦截，而 `Object.defineProperty` 只能对对象的某个属性进行监听。

```js
const handler = {
  get: function(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set: function(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const obj = {
  foo: 1,
  bar: 2
};

const proxy = new Proxy(obj, handler);
console.log(proxy.foo); // Getting foo, 1
proxy.bar = 3; // Setting bar to 3
console.log(proxy.bar); // Getting bar, 3
```

以上代码中，`handler` 是一个拦截器对象，`get` 和 `set` 方法分别用来监听属性的读取和修改操作。在 `get` 方法中，当属性被读取时，会打印出 `Getting ${prop}`，并返回属性值；在 `set` 方法中，当属性被修改时，会打印出 `Setting ${prop} to ${value}`，并将新的属性值赋给目标对象。创建 `proxy` 对象时，传入 `obj` 和 `handler` 参数，即可创建一个代理对象，并对对象的属性读取和修改操作进行拦截和处理。

### Proxy 和 Reflect 有什么关系？

`Proxy` 和 `Reflect` 是 ES6 中新增的两个用于操作对象的原生 API，两者有紧密的关系。

`Proxy` 可以通过 `new Proxy()` 创建一个代理对象，该代理对象可以拦截对象的读取、赋值、函数调用等操作，从而对对象的行为进行定制化处理。而 `Reflect` 则提供了一组操作对象的方法，包括 `Reflect.get()`、`Reflect.set()`、`Reflect.has()` 等等，这些方法与 `Proxy` 拦截器的方法是一一对应的，通过 `Reflect` 方法可以更方便地进行一些对象操作。

例如，一个 `Proxy` 对象可以拦截对象的读取和赋值操作，同时使用 `Reflect` 对象的 `get()` 和 `set()` 方法进行实际的读取和赋值操作，代码示例：

```js
const obj = { name: 'Tom' };

const proxy = new Proxy(obj, {
  get(target, property, receiver) {
    console.log(`读取 ${property} 属性`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`设置 ${property} 属性为 ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

console.log(proxy.name); // 读取 name 属性，输出 Tom
proxy.age = 18; // 设置 age 属性为 18
```

可以看到，`Proxy` 对象拦截了对象的读取和赋值操作，而实际的读取和赋值操作则是通过 `Reflect` 对象的 `get()` 和 `set()` 方法实现的。

### **区别**

`Proxy` 和 `Object.defineProperty` 都是 JavaScript 中用于修改对象属性的机制，但是它们的实现方式和使用方法有很大的区别。

首先，`Object.defineProperty` 是 ES5 中引入的机制，主要用于劫持对象的属性访问器，即 `getter` 和 `setter` 方法，从而可以在获取和设置属性值时进行一些额外的操作，比如数据绑定、属性拦截等。但是，它只能劫持单个属性，如果需要劫持对象的所有属性，则需要遍历对象所有属性并分别使用 `Object.defineProperty` 进行劫持，这样的实现方式非常繁琐和耗时。

相比之下，`Proxy` 是 ES6 中引入的全新的机制，可以拦截对象的多个操作，比如获取属性值、设置属性值、调用方法、枚举属性等。与 `Object.defineProperty` 不同的是，`Proxy` 是对整个对象进行拦截，而不是对单个属性进行拦截，因此使用 `Proxy` 可以更加灵活和高效地处理对象属性的访问和操作。此外，`Proxy` 还提供了很多 `Reflect` 方法来处理对象的默认行为。

另外，`Proxy` 和 `Object.defineProperty` 在支持的浏览器范围上也有一些区别。`Proxy` 是 ES6 中新增的语法，因此在某些旧版本的浏览器中不被支持，而 `Object.defineProperty` 则是在 ES5 中引入的，因此在更广泛的浏览器范围内被支持。

## **数据类型**

**typeof**

typeof 可以用来区分除了 Null 类型以外的原始数据类型，对象类型的可以从普通对象里面识别出函数:	

**instanceof**

instanceof 不能用于判断原始数据类型的数据:	

**Object.prototype.toString.call**



## 继承

### 一、原型链继承

**构造函数、原型和实例的关系：** 每个构造函数都有一个原型对象，原型有一个属性指回构造函数，而实例有一个内部指针指向原型。

**原型链的基本构想：** 如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链

**重点：** 让新实例的原型等于父类的实例。

```js
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function () {
  return this.property
}
function SubType() {
  this.subproperty = false
}
// 继承 SuperType
SubType.prototype = new SuperType()
SubType.prototype.getSubValue = function () {
  return this.subproperty
}
let instance = new SubType()
console.log(instance.getSuperValue()) // true
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
  this.colors = ["red", "blue", "green"]
}
function SubType() {}
// 继承 SuperType
SubType.prototype = new SuperType()
let instance1 = new SubType()
instance1.colors.push("black")
console.log(instance1.colors) // "red,blue,green,black"
let instance2 = new SubType()
console.log(instance2.colors) // "red,blue,green,black"
```

### 二、借用构造函数继承

**重点：** 用.call()和.apply()将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））

```js
function SuperType(name) {
  this.name = name
}
function SubType() {
  // 继承 SuperType 并传参
  SuperType.call(this, "Nicholas")
  // 实例属性
  this.age = 29
}
let instance = new SubType()
console.log(instance.name) // "Nicholas";
console.log(instance.age) // 29
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
  this.name = name
  this.colors = ["red", "blue", "green"]
}
SuperType.prototype.sayName = function () {
  console.log(this.name)
}
function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name) //// 第一次调用 SuperType()
  this.age = age
}
// 继承方法
SubType.prototype = new SuperType() // 第二次调用 SuperType()
SubType.prototype.sayAge = function () {
  console.log(this.age)
}
let instance1 = new SubType("Nicholas", 29)
console.log("instance1=>", instance1)
instance1.colors.push("black")
console.log(instance1.colors) // "red,blue,green,black"
instance1.sayName() // "Nicholas";
instance1.sayAge() // 29
let instance2 = new SubType("Greg", 27)
console.log(instance2.colors) // "red,blue,green"
instance2.sayName() // "Greg";
instance2.sayAge() // 27
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
  F.prototype = o
  return new F()
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
}
let anotherPerson = object(person)
anotherPerson.name = "Greg"
anotherPerson.friends.push("Rob")
let yetAnotherPerson = object(person)
yetAnotherPerson.name = "Linda"
yetAnotherPerson.friends.push("Barbie")
console.log(person.friends) // "Shelby,Court,Van,Rob,Barbie"
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
  F.prototype = o
  return new F()
}

function createAnother(original) {
  let clone = object(original) // 通过调用函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式增强这个对象
    console.log("hi")
  }
  return clone // 返回这个对象
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
}
let anotherPerson = createAnother(person)
anotherPerson.sayHi() // "hi"
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
  F.prototype = o
  return new F()
}

/*function inheritPrototype(subType, superType) { 
 let prototype = object(superType.prototype); // 创建对象
 prototype.constructor = subType; // 增强对象 
 subType.prototype = prototype; // 赋值对象
}*/

function SuperType(name) {
  this.name = name
  this.colors = ["red", "blue", "green"]
}
SuperType.prototype.sayName = function () {
  console.log(this.name)
}
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}
let prototype = object(superType.prototype) // 创建对象
subType.prototype = prototype // 赋值对象
prototype.constructor = subType // 修复实例

//inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age)
}
```

**优先：** 修复了组合继承的问题

**缺点：** 实现麻烦

## 闭包

**定义-----作用------产生--------销毁-------优缺点----什么场景用到--内存泄露溢出---垃圾回收机制**

**定义**

闭包（Closure）是指**有权访问另一个函数作用域中的变量的函数。**在 JavaScript 中，由于**函数具有词法作用域，函数内部可以访问外部函数的变量，而外部函数无法访问内部函数的变量，形成了闭包。**

**销毁：**

当闭包不再被引用时，它占用的内存会被垃圾回收器回收，闭包的变量也会被销毁。

**优点：**

1. 可以帮助我们实现**信息隐藏和数据封装，避免变量名冲突**；

```js
function createCounter() {
  let count = 0 // 外部函数的变量，只能在内部函数中被访问

  return function () {
    count++
    console.log(count)
  }
}

const counter1 = createCounter()
counter1() // 输出 1
counter1() // 输出 2

const counter2 = createCounter()
counter2() // 输出 1
```

在这个例子中，`createCounter` 函数返回了一个内部函数，这个内部函数可以访问 `createCounter` 函数中的 `count` 变量。由于 `count` 变量只能在内部函数中被访问，所以外部代码无法直接修改它，实现了信息隐藏和数据封装的效果。

2. 可以实现**私有变量和方法，保护数据安全**；

```js
function Person(name) {
  let age = 18 // 私有变量

  function getAge() {
    // 私有方法
    return age
  }

  this.getName = function () {
    // 公共方法
    return name
  }

  this.getAge = function () {
    // 公共方法
    return getAge()
  }
}

const person = new Person("张三")
console.log(person.getName()) // 输出 "张三"
console.log(person.getAge()) // 输出 18
```

在这个例子中，`Person` 构造函数中定义了一个私有变量 `age` 和一个私有方法 `getAge`，外部代码无法直接访问它们。同时，`Person` 构造函数也定义了两个公共方法 `getName` 和 `getAge`，外部代码可以通过这两个公共方法访问 `name` 和 `age`。

3. 可以访问外部函数的变量**，实现持久化存储等。**

**缺点：**

1. 闭包占用的内存比较大，**容易造成内存泄漏；**
2. **过度使用闭包会影响性能；**
3. 可能会导致变量长期驻留在内存中**，影响垃圾回收机制的效率**。

**场景：**

1. 实现**函数柯里化；**
2. 实现**单例模式；**
3. 实**现事件绑定和解绑；**
4. 实现 bind 函数
5. 异步循环调用
6. 实**现异步编程，解决回调地狱问题**等。

**内存泄露溢出：**

由于闭包会使函数内部的变量长期驻留在内存中，如果过度使用闭包，可能会导致内存占用过多，从而引起内存泄漏和溢出问题。

**垃圾回收机制：**

当闭包**不再被引用时**，垃圾回收器会将其**标记为垃圾对象**，等待**下一次垃圾回收时被回收**。在 **JavaScript** 中，垃圾回收器使用的是**标记清除算法和引用计数算法**。

**标记清除算法**是指当垃圾回收器确定某个对象不再被引用时，将该对象标记为“可回收”，等待下一次垃圾回收时被回收。

而引用计数算法是指对每个对象维护一个**引用计数器**，当对象被引用时，计数器加一；当对象不再被引用时，计数器减一。当计数器为 0 时，说明对象不再被引用，可以被回收。

JavaScript 引擎使用的是标记清除算法和引用计数算法的结合，称为“标记-清除算法”。垃圾回收器会周期性地执行垃圾回收，遍历所有对象，标记不再使用的对象，然后回收这些对象的内存。

由于闭包会引用外部函数的变量，如果不及时释放，会导致外部函数的变量一直被引用，无法被垃圾回收器回收，从而造成内存泄漏。为了避免内存泄漏，我们应该尽量**避免在循环或定时器中使用闭包，及时释放不再需要的闭包**变量。

## 预解析 执行上下文

**全局作用域-> 全局域解析->js 引擎创建栈->全局执行上下文->入栈->执行->出栈**

### **预解析**

在 JavaScript 中，代码执行前会进行预解析，即将变量声明和函数声明提升到当前作用域的顶部。这意味着变量和函数可以在声明之前被引用，但其值为 undefined。

### 执行上下文

执行上下文是 JavaScript 中的一个概念，它代表了代码执行时的环境，包括**变量、函数、this 等信息。**每个函数在执**行时都会创建一个执行上下文**。执行上下文可以分为全**局执行上下文和函数执行上下文**。

当一个函数被调用时，JavaScript 引擎会创建一个新的函数执行上下文，并将其**压入执行上下文栈**（Execution Context Stack）中。当**函数执行完成后，其执行上下文会被弹出栈。**

## **作用域**

作用域是指变量在代码中的可访问范围。在 JavaScript 中，作用域分 为**全局作用域和局部作用域。**、

全局作用域是指在整个程序中都可以访问的变量，而局部作用域是指在函数内部声明的变量，只能在函数内部访问。**JavaScript 采用的是词法作用域，即变量的作用域在函数定义时就已经确定。**

## JS 的异步？

JavaScript 中的异步是指在程序执行过程中，某些代码不会阻塞后续代码的执行，而是在后台或其他线程中执行，同时允许主线程继续执行下去。这种异步执行机制的目的是提高程序的响应能力和效率。

在 JavaScript 中，常见的异步操作包括通过回调函数、Promise、async/await 等方式实现。例如，定时器、网络请求、文件读取等操作都是异步的。

异步执行的优点是可以提高程序的效率和响应速度，可以避免程序阻塞等问题。同时，异步操作使得程序更加灵活，可以处理更加复杂的逻辑。但是，异步编程也会增加代码的复杂性，需要更加仔细地处理错误和异常情况。

- setTimeout 和 setInterval

这两个 API 用于延迟执行或循环执行某个函数，不会阻塞代码的执行，是一种异步执行的方式。它们的区别在于，setTimeout 只执行一次，而 setInterval 会一直执行下去，直到调用 clearInterval 手动停止它。

- **requestIdleCallback**

requestIdleCallback 是浏览器提供的一个 API，用于在浏览器空闲时执行某些任务，以避免阻塞主线程。当浏览器的主线程空闲时，它会调用 requestIdleCallback 中的回调函数，执行一些比较耗时的任务，直到主线程再次被占用。与 setTimeout 和 setInterval 不同，requestIdleCallback 的回调函数会尽可能地在空闲时间内被调用，而不是在指定的时间后立即执行。

- **requestAnimationFrame**

requestAnimationFrame 也是浏览器提供的一个 API，它用于在下一次浏览器渲染之前执行某些任务。这个 API 通常用于制作动画效果，因为它能够保证动画效果在下一次浏览器渲染之前被执行，避免了卡顿和闪烁的问题。

- Promise

Promise 是一种比较常用的异步编程方式，它可以用于处理各种异步操作，包括从服务器获取数据、操作 DOM、定时器等等。通过 Promise，可以在异步操作完成后执行一些操作，比如更新页面、展示数据等等。

## script标签，defer 和 async 什么区别？

script标签用于加载 JavaScript 文件。`defer` 和 `async` 是 `<script>` 标签的两个属性，它们可以控制 JavaScript 文件的加载和执行。

- `defer` 属性表示脚本可以延迟到文档完全被解析和显示之后再执行，即在文档加载的同时进行下载，但是会延迟执行，等到 HTML 解析完成后才会执行，适用于不依赖 DOM 的脚本。多个 defer 属性的脚本按照它们在页面上出现的顺序依次执行。
- `async` 属性表示脚本在下载后立即执行，但是执行时不会阻塞页面的解析，适用于一些不依赖 DOM 的脚本。多个 async 属性的脚本在下载完成后按照它们完成下载的顺序执行，不保证它们在页面上的顺序。

需要注意的是，`defer` 和 `async` 属性只适用于外部脚本文件，即带有 `src` 属性的脚本文件。如果是内联脚本（即没有 `src` 属性的脚本），则不受 `defer` 和 `async` 属性的影响，会按照在页面上的出现顺序依次执行。同时，如果同时使用了 `defer` 和 `async` 属性，`async` 属性会覆盖 `defer` 属性。



## 事件循环机制

### 事件循环机制

#### 1. **宏任务（Macro Task）和微任务（Micro Task）**

在 JavaScript 的事件循环中，任务可以分为两类：宏任务和微任务。

- **宏任务（Macro Task）**：通常包括 `setTimeout`、`setInterval`、I/O 操作、UI 渲染、事件回调等。宏任务队列中的任务是按先入先出的顺序执行的。
- **微任务（Micro Task）**：通常包括 `Promise` 的回调、`process.nextTick`（Node.js 特有）、MutationObserver 回调等。微任务队列中的任务在每个宏任务执行完之后立即执行，并且优先级高于宏任务。

#### 2. **事件循环的详细步骤**

事件循环的详细工作流程如下：

1. **执行一个宏任务**（如果存在的话，通常是从任务队列中取出并执行）。
2. **执行所有的微任务**（一次性执行所有的微任务）。
3. **更新渲染**（如果需要的话，通常是在浏览器环境下进行渲染更新）。
4. **重复以上步骤**。

#### 3. **实际应用中的事件循环**

在实际应用中，理解事件循环可以帮助优化性能，避免常见的卡顿和延迟问题。

### 高级概念

#### 1. **React 中的事件循环**

在 React 中，特别是 React 18 之后，引入了并发模式（Concurrent Mode）。并发模式可以使得 React 更高效地处理复杂的 UI 更新。

- **Concurrent Mode**：React 使用优先级调度（基于时间分片和微任务机制）来优化 UI 渲染。React 会打断低优先级的渲染任务来及时处理高优先级的任务（如用户输入）。

#### 2. **Node.js 中的事件循环**

Node.js 的事件循环实现基于 `libuv` 库，它的事件循环和浏览器中的事件循环有所不同，包含了更多的阶段：

1. **Timers**：执行 `setTimeout` 和 `setInterval` 的回调。
2. **I/O callbacks**：处理一些延迟的 I/O 回调。
3. **Idle, prepare**：仅限内部使用。
4. **Poll**：检索新的 I/O 事件；执行 I/O 相关回调。
5. **Check**：执行 `setImmediate` 的回调。
6. **Close callbacks**：关闭回调，如 `socket.on('close', ...)`。

### 总结

- **事件循环**是 JavaScript 中处理异步编程的核心机制，它通过任务队列和微任务队列来管理任务的执行。
- **宏任务和微任务**：理解它们的优先级和执行顺序有助于优化代码性能。
- **实际应用**：通过理解事件循环，可以更好地编写高性能、响应迅速的 JavaScript 应用，无论是在浏览器还是 Node.js 环境下。
- **高级应用**：在框架如 React 的并发模式和 Node.js 的复杂事件循环中，事件循环机制进一步优化了异步任务的处理。

通过这些高级细节的理解，可以帮助你在面试中更全面地展示对 JavaScript 事件循环的掌握。



1. 刚开始，整个脚本作为第一个宏任务来执行，对于同步代码直接压入执行栈进行执行，依次执行

2. 1. 先执行同步代码，遇到new Pomise，执行改构造函数中的内容
   2. 碰到resove函数，更改promise的状态，将结果保存下来

3. 有可能启动定时器,有可能发送ajax请求,有可能绑定事件监听,执行这些代码的时候,会把回调函数交给对应的管理模进行管理,而对应的管理模块在分线程执行,不会影响js执行,js会继续向下执行	

4. 比如启动一个setTimeout定时器(有个定时器的管理模块),假设1秒后执行,就会在1秒后把回调放在待执行的回调队列里,此时js有可能还在执行初始化代码,只有初始化代码全部的执行完毕后,一个一个,依次的取出执行（导致定时器不一定准时）

5. 宏任务被放入宏任务队列，微任务放微队列，

6. 遇到promies.then，（如果状态位pending，理解为先不执行它，当他状态改变，再执行），等微任务，放入微任务队列，

7. 本轮宏任务执行完，查找微任务队列，有的话，顺序执行所有的微任务（产生宏任务，放红任务队列，产生微任务，放微任务队列）

8. 1. 发现promise.then这个微任务状态为resolved，执行它

9. **清空微队列中所有微任务 ==> 渲染界(UI线程) ==> 执行宏队列中的第一个宏任务**

10. 1. 浏览器在另一个线程(GUI渲染线程)进行页面渲染操作,
    2. GUI渲染线程与js线程是互斥(不会同时执行), 因为 JS 可以修改 DOM 结构

11. 执行完所有的微任务，执行下一个宏任务，开始新的一轮

## JS 里面如果实现拖拽的功能。

要实现拖拽功能，可以借助 DOM 事件来实现。具体步骤如下：

1. 监听鼠标按下事件（mousedown），记录下鼠标按下时的位置。
2. 监听鼠标移动事件（mousemove），计算鼠标移动的距离，根据移动距离改变拖拽元素的位置。
3. 监听鼠标松开事件（mouseup），取消对鼠标移动事件的监听。

具体实现代码可以参考以下示例：

```html
<!-- HTML 结构 -->
<div id="drag" style="width: 100px; height: 100px; background-color: #ccc; position: absolute; left: 0; top: 0;"></div>

```

```js
// JS 代码
const dragElem = document.getElementById('drag')

let isDragging = false // 是否正在拖拽
let startX = 0 // 鼠标按下时的 X 坐标
let startY = 0 // 鼠标按下时的 Y 坐标

dragElem.addEventListener('mousedown', (e) => {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
})

document.addEventListener('mousemove', (e) => {
  if (!isDragging) {
    return
  }

  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY

  const currentX = parseInt(dragElem.style.left || '0')
  const currentY = parseInt(dragElem.style.top || '0')

  dragElem.style.left = `${currentX + deltaX}px`
  dragElem.style.top = `${currentY + deltaY}px`

  startX = e.clientX
  startY = e.clientY
})

document.addEventListener('mouseup', () => {
  isDragging = false
})
```



以上示例中，我们首先获取到需要拖拽的 DOM 元素，然后在鼠标按下事件（mousedown）中记录下鼠标按下时的位置，随后在鼠标移动事件（mousemove）中计算鼠标移动的距离，并根据移动距离改变拖拽元素的位置。最后，在鼠标松开事件（mouseup）中取消对鼠标移动事件的监听。

## 数组的 sort 默认是按什么排序的？使用的什么算法？

JavaScript 中数组的 sort 方法默认将元素转换为字符串，然后按**照 UTF-16 编码的顺序进行排序**，也就是按照字典序排序。这种排序方式可能不符合我们的需求，因此可以使用 sort 方法的回调函数来指定排序规则。

sort 方法使用的**排序算法是快速排序（QuickSort）**，在大多数浏览器中都是基于原地排序的，也就是说，sort 方法不会创建新的数组，而是直接对原数组进行排序。如果数组元素过多，快速排序的时间复杂度可能会达到 O(n^2)，因此在处理大规模数据时可能需要使用其他排序算法。


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
