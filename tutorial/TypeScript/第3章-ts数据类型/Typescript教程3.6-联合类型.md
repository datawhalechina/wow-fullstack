代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

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