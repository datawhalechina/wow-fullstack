代码运行地址：

在线运行界面 https://www.typescriptlang.org/zh/play

TypeScript 主要包含以下几种运算：

* 算术运算符
* 逻辑运算符
* 关系运算符
* 按位运算符
* 赋值运算符
* 三元/条件运算符
* 字符串运算符
* 类型运算符

### 算术运算符

```typescript
var num1:number = 10 
var num2:number = 2
var res:number = 0
    
res = num1 + num2 
console.log("加:"+res); 

res = num1 - num2; 
console.log("减:"+res) 

res = num1*num2 
console.log("乘:"+res) 

res = num1/num2 
console.log("除:"+res)
    
res = num1%num2 
console.log("余数:"+res) 

num1++ 
console.log("num1 自增运算: "+num1) 

num2-- 
console.log("num2 自减运算: "+num2)
```

### 关系运算符

关系运算符用于计算结果是否为 true 或者 false。包括==、!=、<、>、<=、>=

```typescript
var num1:number = 5;
var num2:number = 9;
 
console.log("num1 的值为: "+num1); 
console.log("num2 的值为:"+num2);
 
var res = num1>num2 
console.log("num1 大于n num2: "+res)
 
res = num1<num2 
console.log("num1 小于 num2: "+res)  
 
res = num1>=num2 
console.log("num1 大于或等于  num2: "+res)
 
res = num1<=num2
console.log("num1 小于或等于 num2: "+res)  
 
res = num1==num2 
console.log("num1 等于 num2: "+res)  
 
res = num1!=num2  
console.log("num1 不等于 num2: "+res)
```

### 逻辑运算符

逻辑运算符用于测定变量或值之间的逻辑。包括&&、||、!

```typescript
var avg:number = 20; 
var percentage:number = 90; 
 
console.log("avg 值为: "+avg+" ,percentage 值为: "+percentage);
  
var res:boolean = ((avg>50)&&(percentage>80)); 
console.log("(avg>50)&&(percentage>80): ",res);
 
var res:boolean = ((avg>50)||(percentage>80)); 
console.log("(avg>50)||(percentage>80): ",res);
 
var res:boolean=!((avg>50)&&(percentage>80)); 
console.log("!((avg>50)&&(percentage>80)): ",res);
```

&& 与 || 是短路运算符。&& 与 || 运算符可用于组合表达式。 && 运算符只有在左右两个表达式都为 true 时才返回 true。

### 赋值运算符

赋值运算符用于给变量赋值。

= (赋值)

+= (先进行加运算后赋值)

-= (先进行减运算后赋值)

*= (先进行乘运算后赋值)

/= (先进行除运算后赋值)

```typescript
var a: number = 12 
var b:number = 10  
 
a = b 
console.log("a = b: "+a)
 
a += b
console.log("a+=b: "+a)
 
a -= b 
console.log("a-=b: "+a)
 
a *= b 
console.log("a*=b: "+a)
 
a /= b 
console.log("a/=b: "+a)  
 
a %= b 
console.log("a%=b: "+a)
```

### 三元运算符 (?)

三元运算有 3 个操作数，并且需要判断布尔表达式的值。该运算符的主要是决定哪个值应该赋值给变量。

```typescript
Test ? expr1 : expr2
```

* Test − 指定的条件语句
* expr1 − 如果条件语句 Test 返回 true 则返回该值
* expr2 − 如果条件语句 Test 返回 false 则返回该值

```typescript
var num:number = -2 
var result = num > 0 ? "大于 0" : "小于 0，或等于 0" 
console.log(result)
```

### 字符串运算符: 连接运算符 (+)

+ 运算符可以拼接两个字符串

```typescript
var msg:string = "hello "+"world" 
console.log(msg)
```

### 类型运算符

##### typeof 运算符

typeof 是一元运算符，返回操作数的数据类型。

```typescript
var num = 12 
console.log(typeof num);   //输出结果: number