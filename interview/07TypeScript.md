---
sidebar_position: 7
title: TypeScript
---

## type 和 interface

### 相同点

- 都可以用来定义对象类型。
- 都支持可选属性和只读属性。
- 都可以扩展（extend）其他类型。

### 不同点

#### `interface`

1. **面向对象编程**：更适合用来定义类的结构。
2. **扩展**：可以使用 `extends` 扩展一个或多个接口。
3. **声明合并**：接口会自动合并相同名称的声明。

```ts
//声明合并
interface Person {
  name: string
}

interface Person {
  age: number
}

const person: Person = {
  name: "Alice",
  age: 30,
}

// 扩展
interface Employee extends Person {
  salary: number
}
```

#### `type`

1. **类型别名**：可以为任何类型（包括原始类型、联合类型、元组等）定义别名。
2. **联合类型**：更灵活，可以定义**联合类型和交叉类型。**
3. **不能声明合并**：类型别名不会自动合并。相同会报错

```ts
// 类型别名可以为基本类型（
type MyString = string
const name: MyString = "Alice"

//对象类型别名
type Person = {
  name: string
  age: number
}

const person: Person = {
  name: "Alice",
  age: 30,
}

// 联合类型
type Status = "success" | "error" | "loading"
const currentStatus: Status = "loading" // 只能是 'success' | 'error' | 'loading' 中的一个

// 交叉类型
type Name = { name: string }
type Age = { age: number }
type Person = Name & Age
const person: Person = {
  name: "Alice",
  age: 30,
}
```

**其他**

- `type` 可**以使用 `typeof` 操作符来获取一个变量或对象的类型**，而 `interface` 不支持这个操作符。

```ts
const person = {
  name: "Alice",
  age: 30,
}

// 使用 typeof 获取 person 对象的类型
type PersonType = typeof person

const anotherPerson: PersonType = {
  name: "Bob",
  age: 25,
}

function getPerson() {
  return {
    name: "Alice",
    age: 30,
  }
}

// 我们使用 ReturnType 内置类型和 typeof getPerson 获取 getPerson 函数的返回值类型，并将其作为类型别名 PersonType 使用
type PersonType = ReturnType<typeof getPerson>

const anotherPerson: PersonType = {
  name: "Bob",
  age: 25,
}
```

### 总结

一般来说，`interface` 更适合用来描述对象的形状，而 `type` 更适合用来定义复杂类型。不过，两者并没有固定的用法，具体要根据实际情况来选择

## void 和 never 区别

### `void`

- **含义**：`void` 类型表示函数没有返回值，或者返回 `undefined` 或 `null`。

- **用途**：主要用于函数的返回类型，表示函数执行完毕后没有返回值。

- **使用场景**：常用于声明没有返回值的函数。

```js
function logMessage(message: string): void {
  console.log(message)
}

const result = logMessage("Hello, TypeScript!") // result 的类型是 void
```

### `never`

- **含义**：`never` 类型表示那些永不存在的值。通常用于表示函数永远不会正常完成（例如抛出错误或无限循环）。
- **用途**：主要用于函数的返回类型，表示函数永远不会返回（如抛出异常或进入无限循环）。
- **使用场景**：常用于声明不可能有返回值的函数。

```ts
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {}
}
```

## any 和 unknow 的区别

### `any`

- **含义**：`any` 类型表示任意类型，使用 `any` 类型的变量可以赋值和访问任何属性，而不会引发类型错误。
- **用途**：主要用于渐进迁移（gradual migration）代码库，或当我们不关心类型时。
- **缺点**：使用 `any` 会关闭 TypeScript 的类型检查机制，从而失去类型安全。

```ts
let anyValue: any

anyValue = 123 // 赋值为数字
anyValue = "hello" // 赋值为字符串
anyValue = true // 赋值为布尔值

// 可以访问任意属性，不会引发类型错误
anyValue.foo()
anyValue.bar = 42
```

### `unknown`

- **含义**：`unknown` 类型也表示任意类型，但它是类型安全的。使用 `unknown` 类型的变量时，必须进行类型检查后才能对其进行操作。
- **用途**：适用于处理不确定类型的数据，同时希望保持类型安全。
- **优点**：使用 `unknown` 强制我们在对值进行操作前进行类型检查，从而提供更好的类型安全。

```ts
//unknownValue 可以被赋值为任何类型，但在访问其属性或方法前，必须进行类型检查
let unknownValue: unknown

unknownValue = 123 // 赋值为数字
unknownValue = "hello" // 赋值为字符串
unknownValue = true // 赋值为布尔值

// 不能直接访问属性或方法，需要先进行类型检查
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()) // 只有在确认类型为 string 后才能调用 string 方法
}

if (typeof unknownValue === "function") {
  unknownValue() // 只有在确认类型为 function 后才能调用函数
}
```

因此，应该尽量使用 `unknown` 类型而不是 `any` 类型，以便开启类型检查，从而减少潜在的类型错误。
