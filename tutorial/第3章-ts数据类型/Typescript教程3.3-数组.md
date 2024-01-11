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