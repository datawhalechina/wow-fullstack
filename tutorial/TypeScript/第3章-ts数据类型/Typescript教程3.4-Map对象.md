代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

## 4.TypeScript Map对象
在 TypeScript 中，`Map` 是一种键-值对的集合，其中键和值可以是任意类型。比普通的JavaScript对象功能更强大。


一个普通的JavaScript对象如下：
```typescript
const user = {
  firstName: "Angela",
  lastName: "Davis",
  role: "Professor",
}
```

Map是ES6（ECMAScript 2015）中引入的一个新的数据结构，用于保存键值对，并且它可以记住键的原始插入顺序。Map的键可以是任何类型的值（包括函数、对象或任何原始值），而普通的JavaScript对象（包括TypeScript中的对象）的键只能是字符串或Symbol。

以下是 TypeScript 中 `Map` 对象常用的一些内置方法：
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


Map对象和普通的对象（如user）之间的主要区别包括：

- 键的类型：Map的键可以是任何类型的值，而普通对象的键只能是字符串或Symbol。
- 大小（Size）：Map对象提供了一个size属性，可以直接获取其包含的键值对数量，而普通对象没有直接的方法来计算其属性数量（尽管可以使用Object.keys(obj).length等方式来间接获取）。
- 迭代：Map是可迭代的，它提供了forEach、keys()、values()和entries()等方法来遍历它的元素，而普通对象虽然可以通过for...in循环、Object.keys()等方法进行遍历，但它们的迭代方式不如Map直接和灵活。

这只是 `Map` 对象提供的一小部分属性和方法。详细的列表可以在 TypeScript 官方文档https://www.typescriptlang.org/zh 中查找。
