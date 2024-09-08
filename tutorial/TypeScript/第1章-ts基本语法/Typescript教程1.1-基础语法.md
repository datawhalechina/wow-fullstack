代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

```typescript
const hello : string = "Hello World!"
console.log(hello)
```

### TypeScript 基础数据类型

number：双精度 64 位浮点值。它可以用来表示整数和浮点数。TS中没有int和float，只有一个number。

string：一个字符系列，使用单引号（'）或双引号（"）来表示字符串类型。反引号（`）来定义多行文本和内嵌表达式。

boolean：表示逻辑值：true 和 false。

enum：枚举类型用于定义数值集合。

```typescript
enum Color {Red, Green, Blue};
let c: Color = Color.Blue;
console.log(c);    // 输出 2
```

void：用于标识方法返回值的类型，表示该方法没有返回值。

还有其他几个不太常用的数据类型：null、undefined、any、never

### TypeScript 变量声明

```typescript
var [变量名] : [类型] = 值;
var uname:string = "hello";
```

声明变量的类型，但没有初始值，变量值会设置为 undefined：

```typescript
var [变量名] : [类型];
var uname:string;
```

声明变量并初始值，但不设置类型，该变量可以是任意类型：

```typescript
var [变量名] = 值;
var uname = "hello";
```

声明变量没有设置类型和初始值，类型可以是任意类型，默认初始值为 undefined：

```typescript
var [变量名];
var uname;
```

### 变量作用域

变量作用域指定了变量定义的位置。

程序中变量的可用性由变量作用域决定。

TypeScript 有以下几种作用域：

* **全局作用域** − 全局变量定义在程序结构的外部，它可以在你代码的任何位置使用。
* **类作用域** − 这个变量也可以称为 **字段**。类变量声明在一个类里头，但在类的方法外面。 该变量可以通过类的对象来访问。类变量也可以是静态的，静态的变量可以通过类名直接访问。
* **局部作用域** − 局部变量，局部变量只能在声明它的一个代码块（如：方法）中使用。

```typescript
var global_num = 12          // 全局变量
class Numbers { 
   num_val = 13;             // 实例变量
   static sval = 10;         // 静态变量
   
   storeNum():void { 
      var local_num = 14;    // 局部变量
   } 
} 
console.log("全局变量为: "+global_num)  
console.log(Numbers.sval)   // 静态变量
var obj = new Numbers(); 
console.log("实例变量: "+obj.num_val)