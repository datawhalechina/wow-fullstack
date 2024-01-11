在Typescript编程当中，我们如何优雅的实现异步编程呢？

利用Await/Async写上层逻辑，利用Deferred/Promise封装回调函数。

我们先来看一下实际工作环境中的一段代码：
这段代码实现的功能是将本地的文件或文件夹上传至hdfs上。
```typescript
    async upload(localPath: string, hdfsPath: string, recursive = false): Promise<void> {
        if (recursive === true) { // 如果上传的是一个目录的话，recursive: true
            const fileDescriptors = await io.readdir(localPath); // 读取文件夹名字
            const promises = fileDescriptors.map((file: string) => this.fnUpload(file, localPath, hdfsPath)); // 得到一个元素为promise的数组
            await Promise.all(promises);等promises这个数组内所有的promise执行完后再继续向后执行
        } else { // 如果上传的是一个文件
            await this.pipe(io.createReadStream(localPath), this._hdfsClient.createWriteStream(hdfsPath.substr(6))); // 建立一个管道把数据发送上去
        }
    }
    async fnUpload(file: string, localPath: string, hdfsPath: string): Promise<void> {
        const stats = await io.stat(path.join(localPath, file)); // 查看当前路径的文件状态

        if (stats.isDirectory()) { // 如果是一个目录
            await this.upload(path.join(localPath, file), hdfsPath.concat(file), true);
        } else { // 如果是一个文件
            await this.upload(path.join(localPath, file), hdfsPath.concat(file));
        }
    }
```

我们主要利用async和await这两个语法糖来用同步的思维方式实现异步，在上面的代码中，我们的想法很自然，如果这个过程希望是同步的，那么我们就在这个方法前加一个await，那么这个await为我们做了什么东西呢？

首先，我们介绍一下promise，promise有三种状态，pending(进行中), fulfilled(已成功), rejected(已失败)，当一个函数返回的是一个promise对象的时候，他会立即返回一个pending状态的promise，这样就不会阻塞你其它代码的执行，而这个函数也在异步执行。

```typescript
function test () {
    return new Promise(resolve, reject)  {
        console.info('my code'); // 你的代码
        if (你的代码执行成功了) {
            resolve(result); // 将结果result传给resolve（）
        } else {
            reject(); // 如果你的代码执行没有成功或者出现了异常
        }
    }
}

test();
console.info('hello, guys');
```

上面这段代码会输出hello, guys,然后再输出my code.

await 后面执行的就是一个promise(如果不是promise会把它转换成promise.resolve(code))，而await要做的事情就是等promise状态变为fullfilled后继续往后执行，这样就实现了暂停等待的效果，而后面的promise的内部可以有更多的异步，只是在上层逻辑需要等待的地方做了等待，很自然。
然而await只能在async声明过的方法内使用，为什么呢？我们来介绍一下async做了什么，
当你在函数钱声明关键字async的时候，编译器认为你这是一个异步函数，他会帮你声明一个promise，将你函数内所有的代码都放在一个promise里面，类似这样：
```typescript
function test () {
    console.info('in');
};

function test () {
    return new Promise() {
        console.info('in');
    }
}
```
这样的好处是我保证了所有await的环境都是异步的，是不会阻塞上层代码的运行的。
那么如果我希望在一个过程中多个部分异步，但是总的这个过程同步呢？
就是我们最初的代码中使用到的Promise.all(array[promise]),参数是一个元素为promise的数组，会返回一个promise，这样你await Promise.all()就可以等这个数组中所有的promise都成功后再继续执行。

通过这种语法糖，我们很自然的把所有的异步和同步逻辑都写完了。代码的可读性也非常高，但这个时候有一个问题，如果我当前的函数是一个异步函数，但是返回的不是promise怎么办呢？
比如我们许多常见的库函数都是通过回调函数来实现在一段代码执行完后再执行另一端代码，
```typescript
function add (num1, num2, callback) {
    var sum = num1 + num2;
    callback(sum);
}

add(1, 2, function (sum) {
    console.log(sum); // 3
});
```

但我们希望看到的是这样的：
```typescript
await add(1, 2);
console.log(sum); // 3
```

怎么实现呢？
答案就是利用 Deferred/Promise把回调函数封装成一个返回promise的函数，

```typescript
function add (num1, num2, callback) {
    var sum = num1 + num2;
    callback(err, sum); // 假装这儿可能会有异常传出来
}

function add_promise (num1, num2) {
    const deferred = new Deferred<number>();
    add (num1, num2, (err, sum) => {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(sum);
        }
    });
    return deferred.promise;
}

const sum = await add_promise(1, 2);
console.log(sum); // 3
```

对于上层的方法调用者来说，代码的可读性强多,也跳出了回调地狱，通过Async/Await, Deferred/Promise的配合，异步编程这块儿，我们就彻底解决了。

原文链接：https://blog.csdn.net/cFarmerReally/article/details/79935077