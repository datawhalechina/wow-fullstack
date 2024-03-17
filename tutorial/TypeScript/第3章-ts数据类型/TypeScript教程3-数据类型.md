代码运行地址：

https://www.runoob.com/try/runcode.php?filename=ts-hw&type=typescript

## 1.TypeScript Number
##### Number 对象是原始数值的包装对象。以下是使用一些`Number`的例子
```typescript
let num1: number = 123; // 整数
let num2: number = 0.456; // 浮点数

// Number 类型还可以表示特殊的值，如 Infinity、-Infinity 和 NaN（非数字）
let notANumber: number = NaN;
let infinity: number = Infinity;

//Number 类型还支持二进制、八进制、十进制和十六进制字面量。
let binary: number = 0b1010; // 二进制
let octal: number = 0o744; // 八进制
let decimal: number = 6; // 十进制
let hex: number = 0xf00d; // 十六进制
```
:::info
**注意：** 如果一个参数值不能转换为一个数字将返回 NaN (非数字值)。
:::
### 内置属性：
##### Number 类型在 TypeScript（和 JavaScript）中有一些内置的属性。以下是一些常用的内置属性

- `Number.MAX_VALUE`：表示 JavaScript 中最大的正数，约为 1.8e+308。如果一个数大于这个值，JavaScript 会返回 Infinity。
- `Number.MIN_VALUE`：表示 JavaScript 中最小的正数（即最接近 0 的正数），约为 5e-324。比这个值更小的值将被转换为 0。
- `Number.NaN`：表示 "Not-a-Number" 值。
- `Number.NEGATIVE_INFINITY`：表示负无穷大。
- `Number.POSITIVE_INFINITY`：表示正无穷大。
- `Number.EPSILON`：表示 1 和比 1 大的最小浮点数之间的差。
- `Number.MAX_SAFE_INTEGER`：表示在 JavaScript 中可以精确表示的最大整数，即 2^53 - 1。
- `Number.MIN_SAFE_INTEGER`：表示在 JavaScript 中可以精确表示的最小整数，即 -(2^53 - 1)。

正常情况下常用的内置属性只有前两种
### 内置方法：
##### Number 类型在 TypeScript（和 JavaScript）中有一些内置的方法。以下是一些常用的内置方法

- `Number.isFinite(number)`：检查传入的参数是否是有限的数字。如果参数是有限的数字，则返回 true，否则返回 false。
- `Number.isInteger(number)`：检查传入的参数是否是整数。如果参数是整数，则返回 true，否则返回 false。
- `Number.isNaN(number)`：检查传入的参数是否是 NaN。如果参数是 NaN，则返回 true，否则返回 false。
- `Number.isSafeInteger(number)`：检查传入的参数是否是安全整数。如果参数是安全整数，则返回 true，否则返回 false。
- `Number.parseFloat(string)`：将字符串解析为浮点数。
- `Number.parseInt(string, radix)`：将字符串解析为指定基数（介于 2 和 36 之间）的整数。
- `Number.prototype.toFixed(digits)`：将数字格式化为字符串，并保留到小数点后指定位数。
- `Number.prototype.toExponential(fractionDigits)`：将数字转换为指数表示法。
- `Number.prototype.toPrecision(precision)`：将数字格式化为字符串，并按指定的精度。
- `Number.prototype.toString(radix)`：将数字转换为字符串。可以指定基数。
```typescript
// Number.isFinite()
let finiteNumber = Number.isFinite(1000); // true
let infiniteNumber = Number.isFinite(Infinity); // false
console.log(finiteNumber, infiniteNumber);

// Number.isInteger()
let integerNumber = Number.isInteger(1000); // true
let floatNumber = Number.isInteger(1000.5); // false
console.log(integerNumber, floatNumber);

// Number.isNaN()
let notANumber = Number.isNaN(NaN); // true
let isANumber = Number.isNaN(1000); // false
console.log(notANumber, isANumber);

// Number.isSafeInteger()
let safeInteger = Number.isSafeInteger(Math.pow(2, 53) - 1); // true
let unsafeInteger = Number.isSafeInteger(Math.pow(2, 53)); // false
console.log(safeInteger, unsafeInteger);

// Number.parseFloat()
let floatFromString = Number.parseFloat("1000.5"); // 1000.5
console.log(floatFromString);

// Number.parseInt()
let integerFromString = Number.parseInt("1000", 10); // 1000
console.log(integerFromString);

// Number.prototype.toFixed()
let num1: number = 123.456;
console.log(num1.toFixed(2)); // "123.46"

// Number.prototype.toExponential()
let num2: number = 123456;
console.log(num2.toExponential(2)); // "1.23e+5"

// Number.prototype.toPrecision()
let num3: number = 123.456;
console.log(num3.toPrecision(2)); // "1.2e+2"

// Number.prototype.toString()
let num4: number = 123;
console.log(num4.toString(10)); // "123"
```
:::info
注意：Number 类型是基于 IEEE 754 双精度浮点数标准实现的。这意味着它不能精确表示所有的实数，特别是对于非常大或非常小的数，或者需要高精度的计算（如金融计算）时，可能会出现精度问题。
:::
## 2.TypeScript String
在 TypeScript 中，String 是一个基本数据类型，用于表示文本数据。你可以使用单引号`'`或双引号`"`来创建字符串。还可以使用反引号```创建模板字符串，这种字符串可以跨越多行并嵌入表达式。以下是一些使用 String` 类型的例子：
```typescript
let str1: string = 'Hello, world'; // 使用单引号
let str2: string = "Hello, world"; // 使用双引号

// 使用反引号创建模板字符串
let str3: string = `Hello,
world`;

// 在模板字符串中嵌入表达式
let name: string = 'world';
let str4: string = `Hello, ${name}`;
```
常用的内置属性和方法
在 TypeScript 中，`String` 类型是 JavaScript 中的字符串类型的静态类型表示。以下是 `String` 类型常用的一些内置属性和方法：
### 内置属性：

1. **length:** 
   - 描述：返回字符串的长度。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.length); // 输出 18
```
 

### 内置方法：

1.  **charAt(index: number): string:** 
   - 描述：返回字符串中指定索引位置的字符。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.charAt(0)); // 输出 'H'
```

2.  **charCodeAt(index: number): number:** 
   - 描述：返回字符串中指定索引位置的字符的 Unicode 编码。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.charCodeAt(0)); // 输出 72
```

3.  **concat(...strings: string[]): string:** 
   - 描述：连接两个或多个字符串，并返回一个新字符串。
   - 示例：
```typescript
let str1: string = "Hello, ";
let str2: string = "TypeScript!";
console.log(str1.concat(str2)); // 输出 'Hello, TypeScript!'
```

4.  **indexOf(searchValue: string, fromIndex?: number): number:** 
   - 描述：返回字符串中第一次出现指定值的索引，如果没有找到则返回 -1。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.indexOf("Type")); // 输出 7
```

5.  **slice(start?: number, end?: number): string:** 
   - 描述：提取字符串的一个片段，并返回一个新字符串。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.slice(0, 5)); // 输出 'Hello'
```

6.  **substring(start: number, end?: number): string:** 
   - 描述：提取字符串的一个子串，并返回一个新字符串。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.substring(0, 5)); // 输出 'Hello'
```

7.  **toUpperCase(): string:** 
   - 描述：将字符串转换为大写。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.toUpperCase()); // 输出 'HELLO, TYPESCRIPT!'
```

8.  **toLowerCase(): string:** 
   - 描述：将字符串转换为小写。
   - 示例：
```typescript
let str: string = "Hello, TypeScript!";
console.log(str.toLowerCase()); // 输出 'hello, typescript!'
```
 这只是 `String` 类型提供的一小部分属性和方法。详细的列表可以在 TypeScript 官方文档中查找。
## 3.TypeScript Array(数组)
在 TypeScript 中，数组（Array）是一种用来表示一系列相同类型元素的数据结构。以下是 TypeScript 中数组常用的一些内置属性和方法：
### 内置属性：

1. **length:** 
   - 描述：返回数组的长度。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
console.log(arr.length); // 输出 5
```
### 内置方法：

1.  **push(...items: T[]): number:** 
   - 描述：将一个或多个元素添加到数组的末尾，并返回数组新的长度。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3];
arr.push(4, 5);
console.log(arr); // 输出 [1, 2, 3, 4, 5]
```

2.  **pop(): T | undefined:** 
   - 描述：移除数组的最后一个元素并返回该元素。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
let lastElement = arr.pop();
console.log(lastElement); // 输出 5
console.log(arr); // 输出 [1, 2, 3, 4]
```
 

3.  **shift(): T | undefined:** 
   - 描述：移除数组的第一个元素并返回该元素。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
let firstElement = arr.shift();
console.log(firstElement); // 输出 1
console.log(arr); // 输出 [2, 3, 4, 5]
```
 

4.  **unshift(...items: T[]): number:** 
   - 描述：将一个或多个元素添加到数组的开头，并返回数组新的长度。
   - 示例：
```typescript
let arr: number[] = [3, 4, 5];
arr.unshift(1, 2);
console.log(arr); // 输出 [1, 2, 3, 4, 5]
```
 

5.  **indexOf(searchElement: T, fromIndex?: number): number:** 
   - 描述：返回数组中第一次出现指定元素的索引，如果没有找到则返回 -1。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
console.log(arr.indexOf(3)); // 输出 2
```
 

6.  **splice(start: number, deleteCount?: number, ...items: T[]): T[]:** 
   - 描述：从数组中移除元素，并在指定位置添加新的元素。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
arr.splice(2, 1, 6); // 从索引 2 开始移除一个元素，然后添加元素 6
console.log(arr); // 输出 [1, 2, 6, 4, 5]
```
 

7.  **slice(start?: number, end?: number): T[]:** 
   - 描述：提取数组的一个片段，并返回一个新数组。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
let slicedArr = arr.slice(1, 4);
console.log(slicedArr); // 输出 [2, 3, 4]
```
 

8.  **forEach(callbackfn: (value: T, index: number, array: T[]) => void): void:** 
   - 描述：对数组的每个元素执行一次提供的函数。
   - 示例：
```typescript
let arr: number[] = [1, 2, 3, 4, 5];
arr.forEach((value, index) => {
  console.log(`Index: ${index}, Value: ${value}`);
});
// 输出:
// Index: 0, Value: 1
// Index: 1, Value: 2
// Index: 2, Value: 3
// Index: 3, Value: 4
// Index: 4, Value: 5
```
 

这只是 TypeScript 中数组提供的一小部分属性和方法。详细的列表可以在 TypeScript 官方文档中查找。
## 4.TypeScript Map对象
在 TypeScript 中，`Map` 是一种键-值对的集合，其中键和值可以是任意类型。以下是 TypeScript 中 `Map` 对象常用的一些内置方法：
### 内置方法：

1.  **set(key: K, value: V): Map<K, V>:** 
   - 描述：向 Map 中添加一个新的键值对。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
```
 

2.  **get(key: K): V | undefined:** 
   - 描述：根据键获取对应的值，如果键不存在则返回 `undefined`。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
console.log(myMap.get("one")); // 输出 1
console.log(myMap.get("three")); // 输出 undefined
```
 

3.  **has(key: K): boolean:** 
   - 描述：检查 Map 中是否包含指定的键。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
console.log(myMap.has("one")); // 输出 true
console.log(myMap.has("three")); // 输出 false
```
 

4.  **delete(key: K): boolean:** 
   - 描述：从 Map 中移除指定键的键值对，如果键不存在则返回 `false`。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
console.log(myMap.delete("one")); // 输出 true
console.log(myMap.delete("three")); // 输出 false
```
 

5.  **clear(): void:** 
   - 描述：移除 Map 中的所有键值对。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
myMap.clear();
```
 

6.  **forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void:** 
   - 描述：对 Map 中的每个键值对执行一次提供的函数。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
myMap.forEach((value, key) => {
  console.log(`Key: ${key}, Value: ${value}`);
});
// 输出:
// Key: one, Value: 1
// Key: two, Value: 2
```
 

7.  **keys(): IterableIterator:** 
   - 描述：返回一个包含 Map 中所有键的迭代器。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
let keys = myMap.keys();
for (let key of keys) {
  console.log(key);
}
// 输出:
// one
// two
```
 

8.  **values(): IterableIterator:** 
   - 描述：返回一个包含 Map 中所有值的迭代器。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
let values = myMap.values();
for (let value of values) {
  console.log(value);
}
// 输出:
// 1
// 2
```
 

9.  **entries(): IterableIterator<[K, V]>:** 
   - 描述：返回一个包含 Map 中所有键值对的迭代器。
   - 示例：
```typescript
let myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
let entries = myMap.entries();
for (let entry of entries) {
  console.log(`Key: ${entry[0]}, Value: ${entry[1]}`);
}
// 输出:
// Key: one, Value: 1
// Key: two, Value: 2
```
 

这只是 `Map` 对象提供的一小部分属性和方法。详细的列表可以在 TypeScript 官方文档中查找。

## 5.TypeScript 元组
在 TypeScript 中，元组（Tuple）是一种固定长度且每个元素类型可以不同的数组。以下是 TypeScript 中元组常用的一些内置属性和方法：
### 内置属性：

1. **length:** 
   - 描述：返回元组的长度。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
console.log(tuple.length); // 输出 3
```
### 内置方法：

1.  **concat(...items: ConcatArray[]): T[]:** 
   - 描述：连接两个或多个数组或值，并返回一个新数组。
   - 示例：
```typescript
let tuple1: [string, number] = ["Hello", 42];
let tuple2: [boolean] = [true];
let result = tuple1.concat(tuple2);
console.log(result); // 输出 ["Hello", 42, true]
```
 

2.  **join(separator?: string): string:** 
   - 描述：将元组的所有元素连接成一个字符串，可指定分隔符。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
let result = tuple.join("-"); // 指定分隔符为 "-"
console.log(result); // 输出 "Hello-42-true"
```
 

3.  **slice(start?: number, end?: number): T[]:** 
   - 描述：提取元组的一个片段，并返回一个新数组。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
let slicedTuple = tuple.slice(1, 2);
console.log(slicedTuple); // 输出 [42]
```
 

4.  **toString(): string:** 
   - 描述：将元组转换为字符串。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
let result = tuple.toString();
console.log(result); // 输出 "Hello,42,true"
```
 

5.  **indexOf(searchElement: T, fromIndex?: number): number:** 
   - 描述：返回数组中第一次出现指定元素的索引，如果没有找到则返回 -1。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
console.log(tuple.indexOf(42)); // 输出 1
```
 

6.  **push(...items: T[]): number:** 
   - 描述：向元组末尾添加一个或多个元素，并返回新的长度。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
tuple.push("world");
console.log(tuple); // 输出 ["Hello", 42, true, "world"]
```
 

7.  **pop(): T | undefined:** 
   - 描述：移除元组的最后一个元素并返回该元素。
   - 示例：
```typescript
let tuple: [string, number, boolean] = ["Hello", 42, true];
let lastElement = tuple.pop();
console.log(lastElement); // 输出 "world"
console.log(tuple); // 输出 ["Hello", 42, true]
```
## 6.TypeScript 联合类型
在 TypeScript 中，联合类型（Union Types）是指一个变量可以具有多种不同的类型。由于联合类型可以是多个类型的集合，因此直接使用联合类型的属性和方法需要确保这些属性和方法在所有可能的类型中都是共有的。以下是 TypeScript 中常见的适用于联合类型的属性和方法：
### 内置方法：

1.  **typeof 类型保护:** 
   - 描述：使用 `typeof` 类型保护来缩小联合类型的范围。通过检查变量的类型，可以在相应分支中安全地访问特定类型的属性和方法。
   - 示例：
```typescript
function printLength(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.length); // 在这个分支中，value 被 TypeScript 理解为字符串类型
  } else {
    console.log(value.toFixed(2)); // 在这个分支中，value 被 TypeScript 理解为数字类型
  }
}
printLength('12321')//5 
printLength(12321);//"12321.00" 
```
 

2.  **类型断言:** 
   - 描述：使用类型断言来告诉 TypeScript 编译器一个变量的确切类型，从而可以安全地访问该类型的属性和方法。
   - 示例：
```typescript
let value: string | number = "Hello";
let len = (value as string).length; // 在这里使用类型断言将 value 明确指定为字符串类型
console.log(len); // 输出 5
```
 

3.  **共有属性检查:** 
   - 描述：在联合类型上使用共有属性，确保所有类型都具有相同的属性。
   - 示例：
```typescript
type StringOrNumber = string | number;

function printValue(value: StringOrNumber): void {
  console.log(value.toString()); // toString 是 string 和 number 共有的方法
}
printValue(12321);//"12321" 
printValue('12321');//"12321" 
```
 

4.  **函数重载:** 
   - 描述：通过函数重载定义多个函数签名，使 TypeScript 能够根据输入值的类型正确调用相应的函数。
   - 示例：
```typescript
function processValue(value: string): void;
function processValue(value: number): void;
function processValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

processValue("Hello"); // 调用第一个函数签名，"HELLO" 
processValue(42); // 调用第二个函数签名，"42.00" 
```
这些方法和技巧可以帮助你在使用联合类型时更安全地处理属性和方法。根据具体的使用场景，选择合适的方式以确保代码的正确性和类型安全性。
以上这些只是 TypeScript 中提供的一小部分属性和方法。详细的知识点于方法可以在 TypeScript 官方文档中查找。


