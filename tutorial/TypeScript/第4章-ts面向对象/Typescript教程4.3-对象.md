# TypeScript 对象

对象是包含一组键值对的实例。 值可以是标量、函数、数组、对象等，如下实例：
```typescript
var object_name = { 
    key1: "value1", // 标量
    key2: "value",  
    key3: function() {
        // 函数
    }, 
    key4:["content1", "content2"] //集合
}

// 以上对象包含了标量，函数，集合(数组或元组)。
```

对象实例

```typescript
var sites = { 
   site1:"Apple", 
   site2:"Google" 
}; 
// 访问对象的值
console.log(sites.site1) 
console.log(sites.site2)

// Apple
// Google
```


## TypeScript 类型模板

假如我们在 JavaScript 定义了一个对象：

```typescript
var sites = { 
   site1:"Apple", 
   site2:"Google" 
};
```

这时如果我们想在对象中添加方法，可以做以下修改：
```typescript
sites.sayHello = function(){ return "hello";}
```

如果在 TypeScript 中使用以上方式则会出现编译错误，因为Typescript 中的对象必须是特定类型的实例。

```typescript
var sites = {
    site1: "Apple",
    site2: "Google",
    sayHello: function () { } // 类型模板
};
sites.sayHello = function () {
    console.log("hello " + sites.site1);
};
sites.sayHello();

// hello Apple
```

此外对象也可以作为一个参数传递给函数，如下实例：

```typescript
var sites = { 
    site1:"Apple", 
    site2:"Google",
}; 
var invokesites = function(obj: { site1:string, site2 :string }) { 
    console.log("site1 :"+obj.site1) 
    console.log("site2 :"+obj.site2) 
} 
invokesites(sites)

// site1 :Apple
// site2 :Google
```