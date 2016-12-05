# 一个依赖注入小框架的实现

之前一篇文章从原理上介绍了依赖注入这个概念（依赖注入简介）。为了更好的理解，本文通过ES5的代码实现一个依赖注入小框架，它叫做`DI`，它提供了`register`方法来注册服务，`inject`方法来注入服务，`lookup`方法来查找服务。先从这个小框架的使用方式开始：

```js

// 定义了一个常值服务
var con = 0;

// 定义了一个函数服务
var fun = function (n) {
    // fun依赖服务con
    var con = DI.lookup('con');

    return con;
}

// 定义了一个类（对象）服务
function A () {
    // 依赖了服务con和fun
    DI.inject(this, [
        'c: con',
        'f: fun'
    ]);

    this.sum = this.f(this.c);
}
A.prototype = {
    getSum: function () {
        this.sum += 1;
        return this.sum;
    }
}

// 注册到框架中
DI.register('con', {type: DI.CONSTANT, value: con});
DI.register('fun', {type: DI.FUNCTION, value: fun});
DI.register('A', {type: DI.CLASS, value: A});

function B () {
    // 注入A的一个实例给B
    DI.inject(this, [
        'a: A'
    ]);

    console.log('B: ' + this.a.getSum());
}
function C () {
    // 注入A的一个实例给C
    DI.inject(this, [
        'a: A'
    ]);

    console.log('C: ' + this.a.getSum());
}
function D () {
    // 注入A的一个实例给D，A类前面一个加号表示单独拥有一个A的实例
    DI.inject(this, [
        'a: +A'
    ]);

    console.log('D: ' + this.a.getSum());
}

var b = new B(),
    c = new C(),
    d = new D();
```

输出：

```js
B: 1
C: 2
D: 1
```

先介绍下语法：

- `c: con`表示依赖于`con`这个服务，并命名为`c`
- `a: +A`表示依赖并独享`A`这个服务的实例，并命名为`a`

从上面的代码可以发现D是独享一个A的实例（输出1），而B和C共享了一个实例（先输出1，然后累加输出2）。上面的示例代码已经演示完了这个`DI`小框架的所有用法了，那么它是如何实现这个功能的呢，且看下面的代码。

小框架`DI`的源码：

```js

var DI = (function () {

    // 定义服务类型
    var CLASS = 1, // 类（对象）
        CONSTANT = 2, // 常值
        FUNCTION = 3; // 函数

    // 存放注册的服务们
    var services = {};

    // 存放共享的实例
    var instances = {};

    var getNew = function (name) {
        var service = services[name];
        switch (service.type) {
            case CLASS:
                return new service.value();
            case CONSTANT:
                return service.value;
            case FUNCTION:
                return service.value;
        }
    };

    var getOne = function (name) {
        if (name[0] === '+') {

            // 单独享用一个实例，直接方法
            return getNew(name.slice(1));
        } else if (typeof instances[name] === 'undefined') {

            // 把共享的实例存起来
            instances[name] = {
                value: getNew(name)
            };
            return instances[name].value;
        } else {
            return instances[name].value;
        }
    }

    return {
        CLASS: CLASS,
        CONSTANT: CONSTANT,
        FUNCTION: FUNCTION,

        // 向依赖框架注册一个服务（可被依赖）
        register: function (name, service) {
            services[name] = service;
        },

        // 注入依赖
        inject: function (self, names) {
            names.map(function (name) {
                var temp = name.split(':');
                self[temp[0].trim()] = getOne(temp[1].trim());
            })
        },

        // 查找依赖
        lookup: function (name) {
            return getOne(name);
        }
    }

})();
```

是不是觉得很简单。其实就是用一个对象来管理这些依赖，如果没有实例，它就去生成一个，如果想独享一个实例，它就去实例化一个新的实例。
