## TypeScript 泛型

泛型（Generics）是一种编程语言特性，允许在定义函数、类、接口等时使用占位符来表示类型，而不是具体的类型。

泛型是一种在编写可重用、灵活且类型安全的代码时非常有用的功能。

使用泛型的主要目的是为了处理不特定类型的数据，使得代码可以适用于多种数据类型而不失去类型检查。

泛型的优势包括：

- 代码重用： 可以编写与特定类型无关的通用代码，提高代码的复用性。

- 类型安全： 在编译时进行类型检查，避免在运行时出现类型错误。

- 抽象性： 允许编写更抽象和通用的代码，适应不同的数据类型和数据结构。

## 泛型标识符
在泛型中，通常使用一些约定俗成的标识符，比如常见的 T（表示 Type）、U、V 等，但实际上你可以使用任何标识符。

T: 代表 "Type"，是最常见的泛型类型参数名。

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

K, V: 用于表示键（Key）和值（Value）的泛型类型参数。
```typescript
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}
```

这些标识符是约定俗成的，实际上你可以选择任何符合标识符规范的名称。关键是使得代码易读和易于理解，所以建议在泛型类型参数上使用描述性的名称，以便于理解其用途。


## 泛型函数（Generic Functions）

使用泛型来创建一个可以处理不同类型的函数：
```typescript
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数
let result = identity<string>("Hello");
console.log(result); // 输出: Hello

let numberResult = identity<number>(42);
console.log(numberResult); // 输出: 42
```

解析： 以上例子中，identity 是一个泛型函数，使用 <T> 表示泛型类型。它接受一个参数 arg 和返回值都是泛型类型 T。在使用时，可以通过尖括号 <> 明确指定泛型类型。第一个调用指定了 string 类型，第二个调用指定了 number 类型。


## 泛型接口（Generic Interfaces）

可以使用泛型来定义接口，使接口的成员能够使用任意类型：

```typescript
// 基本语法
interface Pair<T, U> {
    first: T;
    second: U;
}

// 使用泛型接口
let pair: Pair<string, number> = { first: "hello", second: 42 };
console.log(pair); // 输出: { first: 'hello', second: 42 }
```
解析： 这里定义了一个泛型接口 Pair，它有两个类型参数 T 和 U。然后，使用这个泛型接口创建了一个对象 pair，其中 first 是字符串类型，second 是数字类型。


## 泛型类（Generic Classes）

泛型也可以应用于类的实例变量和方法：
```typescript
// 基本语法
class Box<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }
}

// 使用泛型类
let stringBox = new Box<string>("TypeScript");
console.log(stringBox.getValue()); // 输出: TypeScript
```
解析： 在这个例子中，Box 是一个泛型类，使用 <T> 表示泛型类型。构造函数和方法都可以使用泛型类型 T。通过实例化 Box<string>，我们创建了一个存储字符串的 Box 实例，并通过 getValue 方法获取了存储的值。

## 泛型约束（Generic Constraints）

有时候你想限制泛型的类型范围，可以使用泛型约束：

```typescript
// 基本语法
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}

// 正确的使用
logLength("hello"); // 输出: 5

// 错误的使用，因为数字没有 length 属性
logLength(42); // 错误
```
解析： 在这个例子中，定义了一个泛型函数 logLength，它接受一个类型为 T 的参数，但有一个约束条件，即 T 必须实现 Lengthwise 接口，该接口要求有 length 属性。因此，可以正确调用 logLength("hello")，但不能调用 logLength(42)，因为数字没有 length 属性。


## 泛型与默认值

可以给泛型设置默认值，使得在不指定类型参数时能够使用默认类型：
```typescript
// 基本语法
function defaultValue<T = string>(arg: T): T {
    return arg;
}

// 使用带默认值的泛型函数
let result1 = defaultValue("hello"); // 推断为 string 类型
let result2 = defaultValue(42);      // 推断为 number 类型
```
说明： 这个例子展示了带有默认值的泛型函数。函数 defaultValue 接受一个泛型参数 T，并给它设置了默认类型为 string。在使用时，如果没有显式指定类型，会使用默认类型。在例子中，第一个调用中 result1 推断为 string 类型，第二个调用中 result2 推断为 number 类型。
