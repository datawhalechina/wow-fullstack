代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

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
 这只是 `String` 类型提供的一小部分属性和方法。详细的列表可以在 TypeScript 官方文档https://www.typescriptlang.org/zh 中查找。