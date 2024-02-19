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
