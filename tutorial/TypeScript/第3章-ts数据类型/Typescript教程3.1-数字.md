代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

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