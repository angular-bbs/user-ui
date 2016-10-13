# *RxJS Overview* 阅读笔记

*RxJS Overview*为官方对RxJS的一个概述，点击[这里](http://reactivex.io/rxjs/manual/overview.html)进行原文阅读。

## 前言

本文是阅读*RxJS Overview*所做的笔记。该概述写的非常之清晰和简洁，是很好的初学RxJS入门资料。概述内容包括：**RxJS涉及到的主要概念及概念相关的必要背景知识**，其中主要概念包括：Observable、Observer、Subscription、Subject、Operator、Scheduler，本文会一一进行介绍。尤其是那些时不时出现的手书斜体格式的总结文字，非常值得认真思考的。本文尝试进行总结，力求把RxJS的核心思想表达清楚。

用一句话介绍RxJS的话，就是**RxJS将异步抽象为数据流，并提供对数据流进行各种操作的接口**。

## 数据传输

数据从生产者传输到消费者那里，有两种方式：一是消费者从生产者那里拉取（**pull**）数据，二是生产者推送（**push**）数据给消费者。前者就是常见的函数调用（消费者调用生产数据的函数），后者则是用于处理异步的回调方式（消费者只定义接受数据的函数，然后供生产者调用），也就是由哪一方去主动调用。如下代码所示：

```js
// 拉取式
var producer = function () {
    var data = 42;
    return data;
}
var consumer = function () {
    // 数据消费者主动调用数据生产函数
    var data = producer();
    // 可以消费数据了
}
// 直接获取数据并进行消费
consumer();
```

```js
// 推送式
var producer = function (consumer) {
    setTimeout(function () {
        var data = 42;
        // 数据生产者推送数据给数据消费者
        consumer(data);
    }, 3000)
}
var consumer = function (data) {
    // 可以消费数据了
}
// 等到异步数据准备好时，就会调用消费者
// 调用之后才可以消费数据
producer(consumer);
```

拉取的方式，常用在获取同步数据上；而推送的方式，则更多用在获取异步数据上。会有异步数据这个说法，是因为有些数据的获取需要等待（比如浏览器通过URL接口获取服务器上的数据）。如果数据消费者在原地傻傻地等着数据，而不去做其他的事情，必然导致效率低下。正确的做法是在数据还没有到的时候去做其他的事情，等数据到了再来通知消费者。

在获取异步数据上面，常见的有事件监听和Promise（都是通过回调）。区别是事件监听可以触发多次回调，一个Promise只能触发一次回调。**一次和多次更深层次的区别，在于生产者可以有多少个返回值**。RxJS是两者的结合，**提供了Promise形式的异步编程方式（看起来像同步），但又有多个返回值**。对比以下代码就很容易理解上一句话了：

```js
// 事件监听
button.addEventListener('click', function (event) {
    // 触发回调的时机是该元素被点击了
    // 现在可以消费数据event了
})

// Promise
var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        var data = 42;
        resolve(data);
    }, 3000);
});
promise.then(function (data) {
    // 可以开始消费数据data了
});

// RxJS
var observable = Rx.Observable.fromEvent(button, 'click');
observable.subscribe(function (event) {
    // 可以开始消费数据event了
})
```

## 基本概念

**除了拥有对异步处理能力，RxJS还提供了对生产的数据的进行常见操作的接口，以及提供不同的触发回调的策略（比如同步、异步等）**。理解RxJS的概念有利于更好地利用它，接下来介绍RxJS所包含的基本概念。

### Observable

使用RxJS的第一步就是得到一个Observable，Observable是一个含有数据生产过程的对象。Observable的特点是不主动运行数据生产过程，而是需要被启动（懒运算）。同时它可以被多次启动，并且每次启动得到的对象没有任何关系。

**没有任何关系**的意思是回调独享一份数据，不同启动中的回调不共享数据。且看如下代码（展示Observable中回调独享数据的特点）：

```js
var observable = Rx.Observable.create(function (observer) {
  observer.next({
      a: 1,
      b: 2
  });
});
observable.subscribe({
    next: function (data) {
        console.log(data.a); // 输出 1
        data.a = 3;
    }
});
observable.subscribe({
    next: function (data) {
        console.log(data.a); // 输出 1
        data.a = 3;
    }
});
```

### Observer

Observer是一个包含回调函数的对象（可包含`next`、`complete`、`error`三种回调），比较好理解。例如上面在调用`subscribe`时所传入的参数，就是一个Observer。

### Subscription

Subscription是调用Observable的启动生产数据过程的方法（比如`subscribe`）所返回的对象，表示Observable的执行过程。这个过程可以被取掉。

### Subject

Subject是Observable的一个变体，区别是Subject只能启动一次，而Observable可以被多次启动。这就意味着数据在所有的回调中共享。另外一点区别是后添加的回调无法处理生产数据过程之前产生的数据。且看如下代码（展示Subject中回调共享数据的特点）：

```js
var subject = new Rx.Subject();
subject.subscribe({
    next: function (data) {
        console.log(data.a); // 输出 3
        data.a = 3;
    }
});
subject.subscribe({
    next: function (data) {
        console.log(data.a); // 输出 3
    }
});
subject.next({
    a: 1,
    b: 2
});
```

### Operator

Operator是操作异步数据的方法，其返回另一个Observable对象，可链式调用。常见的操作有处理数据（`map`）、过滤数据（`filter`）、累积数据（`reduce`）。例如以下示例代码：

```js
Rx.Observable.of(0, 1, 2, 3)
    .map((n) => n * n) // 每项取平方
    .filter((n) => n > 0) // 取出平方后大于0的项
    .reduce((acc, curr) => acc + curr, 0) // 累加每一项
    .subscribe((sum) => console.log(sum)); // 输出 14，等于1*1 + 2*2 + 3*3
```

### Scheduler

Scheduler指触发回调的策略，是一个对象。这里的策略，控制了触发回调的时机。比如把触发放到下一次事件循环里面去。以下代码展示了使用`async`策略的运行结果（重点在于使用`async`策略会异步触发回调，）：

```js
var observable = Rx.Observable.create(function (observer) {
    console.log('a');
    observer.next(1);
    console.log('b');
    observer.complete();
    console.log('c');
}).observeOn(Rx.Scheduler.async);

console.log('before');
observable.subscribe({
  next: (x) => console.log(x),
  complete: () => console.log('done'),
});
console.log('after');
```

输出顺序如下：

```
before
a
b
c
after
1
done
```

由于目前JS解释器都是单线程运行JS代码，Scheduler的作用局限于提供异步等策略。但是在Rx.NET等服务端的实现中，Scheduler有非常大的作用，比如可以将耗时的任务放到新的线程中，从而提高主线程的响应速度。对这部分感兴趣的同学可以去阅读Rx的服务端实现，比如Rx.NET。

## 总结

本文主要介绍了RxJS中涉及到的基本概念，并提供代码示例。理解这些概念是使用好RxJS的基础，同时RxJS包含了丰富的Operator。在解决实际问题时，对这些Operator的理解会有利于找到快速高效的解决方法。如果你打算继续深入学习RxJS的话，建议从Operator入手，并结合实际问题。

现遗留下来的问题是：为什么要使用RxJS？RxJS适合哪些问题？这些是下一篇RxJS文章所涉及到的内容，敬请期待。