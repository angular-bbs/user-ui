# 白话RxJS

初稿日期：2016-11-02

## 变量命名Style
（个人约定，非任何best practice）
- `Observable`变量以`$`结尾，如`state$`；  
- `Subject`变量以`$$`结尾， 如`state$$`；  
- `Subscription`变量以`_`结尾，如`ultimate_`。 

## 写作目的
`RxJS`包含许多概念，[RxJS Manual][]在介绍RxJS的时候，引入了更多概念，对于初学者而言，不够直白。  
比如：
> ReactiveX combines the Observer pattern with the Iterator pattern and functional programming with collections to fill the need for an ideal way of managing sequences of events.  

再如：
> Observable: represents the idea of an invokable collection of future values or events.  

本文将尝试用`白话`来解读RxJS。  
比如：
> `Observable`：好似一个`Function`，有很多`return`，定义了在哪个时点`return`什么数据。

部分章节使用了`伪代码`，用来说明某个类的特性；其余部分，受限于水平，实在写不出伪代码。   
难免错漏，敬请指正。

## Observer：一个Object，有3种callback
`Observer`最平易近人，就是一个`Object`，里面有3种`callback`，形如：  

```js
const observer = {
  next: (value) => console.log(value),
  error: (error) => console.log(error),
  complete: () => console.log('completed')
}
```

## Observable：好似一个Function，有很多return，定义了在哪个时点return什么数据
可以对照`Function`来看`Observable`。  
`Function`是这样：  

```js
const funcX = () => {
  在处理处理处理以后：
    return 'gogogo, but only once';
}
```
`Observable`就是这样：  

```js
const x$ = () => {
  （无条件的）： 
    return 'I\'m the 1st go';
  在'500 ms'以后: 
    return 'I\'m the 2nd go';
  ...
  在http请求出错时：
    return 'something went wrong';
  // 然后就没有然后了
}
```
`Observable`可以`return`很多次，任意多次，每次`return`可能需要满足一定条件，比如“鼠标点击的时候”。  
可是，怎么可能`return`多于1次呢？  
这是伪代码，其实`Observable`应该是这样：  

```js
const x$ = (observer) => {
  （无条件的）： 
    observer.next('I\'m the 1st go');
  在'500 ms'以后: 
    observer.next('I\'m the 2nd go');
  ...
  在http请求出错时：
    observer.error('something went wrong');
  // 然后就没有然后了
}
```
我们需要一个`Observer`，并用`observer.callback`来代替`return`。  


## 启动Observable：用Observable.subscribe(observer)
`Function`在定义好以后，不会自动运行，`Observable`也是一样。  
我们可以通过`funX()`（即在函数名后加上括号）来调用`funX`。   
怎样调用`Observable`呢？看这里：  

```js
const FakeObservableClass = function() {
  this.execution = (observer) => {
      observer.next('I\'m the 1st go');
      observer.next('I\'m the 2nd go');
  }
}

FakeObservableClass.prototype.subscribe = function(observer) {
  const that = this;
  that.execution(observer);
}

const x$ = new FakeObservableClass();
const observer = {next: (value) => console.log(value)};
x$.subscribe(observer); // 启动x$的运行
```
我们是通过`subscribe`方法，即`x$.subscribe(observer)`来启动`x$`的运行的。  


## Subscription：一个Object，有一个方法unsubscribe，可以停掉运行中的Observable
`Function`在启动以后是停不下来的，直到`return`。  
`Observable`在`subscribe`以后，如果`execution`的内容是`async`的（比如`setInterval`、`dom events`、`http response`），它是可以停下来的。  
以`IntervalObservable`为例： 

```js
const FakeIntervalObservableClass = function(interval) {
  this.intervalId = null;

  this.execution = (observer) => {
    let state = 0;
    let execute = (state) => {
      this.intervalId = setInterval(() => {
        observer.next(++state);
      }, interval);
    }
    execute(state);
  }
}

FakeIntervalObservableClass.prototype.subscribe = function(observer) {
  const that = this;
  that.execution(observer); // subscribe的时候会执行setInterval
  // 接下来return一个Obeject，这个Object就是Subscription
  return {
    unsubscribe: () => {
      clearInterval(that.intervalId); // unsubscribe时执行clearInterval
    }
  }
}

const x$ = new FakeIntervalObservableClass(500);
const observer = {next: (value) => console.log(value)};
const x_ = x$.subscribe(observer); 
x_.unsubscribe();
``` 
`subscribe`方法返回一个`Object`，这个`Object`就是`Subscription`（即`x_`），它唯一的用途就是`unsubsribe`。  
`unsubscribe`会停下`Observable`的运行，并释放其占用的资源。  
上面的例子中，当我们调用`x_.unsubscribe()`的时候，触发了`clearInterval`，后面的execution就不再进行下去了。  
如果是`dom事件触发的Observable`，`subscribe`时会`addEventListener`，`unsubscribe`时会`removeEventListener`。  
如果是`XMLHttpRequest触发的Observable`，就是`send`和`abort`，等等。

## Subject：有next和subscribe方法，有一个observers列表
`Subject`是一个`Observable`，因为它有`subscribe`方法；`Subject`又是一个`Observer`，因为它有`next`方法。  
它维护一个observers列表，当运行`subject.subscribe(observerX)`的时候，这个`observerX`就被加到列表里，`unsubscribe`时从列表中删掉。   
`Subject`像是一个proxy，外部调用`subject.next(value)`时，这个`value`会被`forEach`给`Subject`的`observers`。  

```js
const FakeSubjectClass = function() {
  this.observers = [];
}

FakeSubjectClass.prototype.subscribe = function(observer) {
  let that = this;
  // 添加新observer，添加之前会检查是否observers已经有了这个observer，如果有，就什么也不做
  if (that.observers.indexOf(observer) >= 0) return;
  that.observers.push(observer);
  return {
    unsubscribe: () => {
      // 从observers列表里将这个observer删除
      that.observers = that.observers.filter((observerX) => observerX !== observer) 
    }
  }
}

FakeSubjectClass.prototype.next = function(value) {
  let that = this;
  that.observers.forEach(observer => observer.next(value)); // 外部调用subject.next，subject.next马上forEach转出去；这个就是multicast
}

let x$$ = new FakeSubjectClass(); // Subject以$$结尾，Observable以$结尾

let observerB = {next: (value) => {console.log(`另一个logger说：${value}`)}}
x$$.subscribe(observerB); // 这个observerB被加到了x$$的observers列表里。

x$.subscribe(x$$); // 当x$向外推送时，调用的是x$$.next；x$$.next转身马上就forEach转给它的observers。
```
顺带提一下`unicast`和`multicast`的资源消耗。  
说`Observable`是`unicast`，而`Subject`是`multicast`，就是因为这个`observers列表` -- 在`Observable`里是没有的这个列表的。   
每次运行`Observable.subscribe()`都相当于一个`Function.call()`，是一个独立的运行，需要单独消耗资源。  
而`Subject.subscribe()`消耗资源很少。  
比如：

```js
let y$ = Observable.whatever() // 创建新的Observable
let y1_ = y$.subscribe(observerA); // 运行一次y$里的execution，消耗资源
let y2_ = y$.subscribe(observerB); // 又运行一次...
let y3_ ...                        // 又...
// ===========

let z$ = Observable.whatever();
let z$$ = new Subject();
let z1_ = z$$.subscribe(observerX) // observers列表里加一项，基本不消耗什么资源
let z2_ = z$$.subscribe(observerY) // observers列表里加一项
let z0_ = z$.subscribe(z$$) // 运行一次z$里的execution，仅此一次，然后z$推给z$$，z$$用forEach推给后面

```

## Operator：一半AllSpark（创建Observable），一半滤镜（变更推送时点和推送内容）
在`Observable类`上调用的`Operator`是`Static Operator`， 比如：

```js
Observable.interval(500);  // 每隔500ms，推送一个递增整数，从0开始
Observable.from([1, 2]);   // 连续推送1, 2
Observable.fromEvent(document, 'click'); // 每次点击，推送一个event Object
Observable.fromPromise(fetch('/users')); // resolve或reject时，推送给Observer
Observable.ajax('/users')  // http 'GET' /users，response或error时，推送给Observer
const ws$$ = Observable.webSocket('ws://echo.websocket.org/') // 这个ws$$是个Subject
// 通过ws$$.next(JSON.stringify(value))向websocket发送信息
// 通过ws$$.subscribe(observer)来接收信息
Observable.merge(x$, y$);  // 将x$与y$的推送混合在一起
Observable.concat(x$, y$); // 先运行x$，等x$推送observer.complete()，再运行y$
...
```
`Static Operator`可以从无到有创建一个`Observable`（像是变形金刚里的AllSpark），也可以把互不干预的`Observable`组合起来。  
前面的伪代码中用到`const x$ = new FakeObservableClass();`。  
实际生活中`new Observable()`都是由Static Operator来处理的，所以在代码中不会看到`new Observable()`。  

===== 分割线 =====

在`Observable的实例`上调用的`Operator`是`Instance Operator`， 比如：

```js
const x$ = Observable.interval(500); // 创建一个Observable实例
const y$ = x$
  .map(v => v*3)                     // 每个推送的数值乘以3
  .filter(w => w%5 === 1)            // 只推送除以5余数为1的数值
  .delay(1000)                       // 等待1秒再推送
  .take(10)                          // 推送10个数值以后，调用observer.complete()结束
x$ !== y$                            // x$还是那个x$
...
```
如果`Observable`是一幅画，`Instance Operator`就是滤镜。  
经过滤镜处理，我们拿到了一幅新的画，原来的画还在。  


## Scheduler：控制并发事件
`Scheduler`的职能是控制并发事件。本人开发经验接近0，实在想不出实际生活中何时会用到`Scheduler`，也确实在实践中没用过。  
如果要观察每种`Scheduler`对数据推送的影响，可以打开[RxJS Manual][]，开启`console`，贴入下面的代码，回车。

```js
const x$ = Rx.Observable.create((observer) => {
  observer.next(0);
  observer.next(1);
}) // 这个用的是null Scheduler
const xOnQueue$ = x$.map(v=>'onQueue'+v).observeOn(Rx.Scheduler.queue);
const xOnAsync$ = x$.map(v=>'onAsync'+v).observeOn(Rx.Scheduler.async);
const xOnAsap$ = x$.map(v=>'onAsap'+v).observeOn(Rx.Scheduler.asap);
const xOnAnimationFrame$ = x$.map(v=>'onAnimationFrame'+v).observeOn(Rx.Scheduler.animationFrame);
const merged$ = Rx.Observable.merge(xOnAnimationFrame$, xOnAsync$, xOnAsap$, xOnQueue$, x$);
// 注意Observable.merge时的顺序，再对照console.log中的输出顺序
const merged_ = merged$.subscribe(console.log);
```


## 总结
提到`Observable`的时候，就想想`Function`，一个脱离了低级趣味的（有随意数量`return`的）`Function`，一个有益于人民的（定义了在某个时点`return`什么数据的）`Function`。  

**Happy coding!**

## 参考
[RxJS Source Code][]
[RxJS Manual][]

[RxJS Source Code]: https://github.com/ReactiveX/rxjs
[RxJS Manual]: http://reactivex.io/rxjs/manual/index.html
