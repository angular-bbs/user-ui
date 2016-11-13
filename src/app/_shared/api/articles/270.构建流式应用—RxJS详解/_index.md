最近在 Alloyteam Conf 2016 分享了《使用RxJS构建流式前端应用》，会后在线上线下跟大家交流时发现对于 RxJS 的态度呈现出两大类:有用过的都表达了 RxJS 带来的优雅编码体验，未用过的则反馈太难入门。所以，这里将结合自己对 RxJS 理解，通过 RxJS 的实现原理、基础实现及实例来一步步分析，提供 RxJS 较为全面的指引，感受下使用 RxJS 编码是怎样的体验。

# 目录
- 常规方式实现搜索功能
- RxJS · 流 Stream
- RxJS 实现原理简析
  - 观察者模式
  - 迭代器模式
  - RxJS 的观察者 + 迭代器模式
- RxJS 基础实现
  - Observable
  - Observer
- RxJS · Operators
  - Operators ·入门
  - 一系列的 Operators 操作
- 使用 RxJS 一步步实现搜索功能
- 总结

-------------------------------------------

# 常规方式实现搜索
做一个搜索功能在前端开发中其实并不陌生，一般的实现方式是：监听文本框的输入事件，将输入内容发送到后台，最终将后台返回的数据进行处理并展示成搜索结果。
``` html
<input id="text"></input>
<script>
    var text = document.querySelector('#text');
    text.addEventListener('keyup', (e) =>{
        var searchText = e.target.value;
        // 发送输入内容到后台
        $.ajax({
            url: `search.qq.com/${searchText}`,
            success: data => {
              // 拿到后台返回数据，并展示搜索结果
              render(data);
            }
        });
    });
</script>
```

上面代码实现我们要的功能，但存在两个较大的问题：

1. 多余的请求
当想搜索“爱迪生”时，输入框可能会存在三种情况，“爱”、“爱迪”、“爱迪生”。而这三种情况将会发起 3 次请求，存在 2 次多余的请求。

2. 已无用的请求仍然执行
一开始搜了“爱迪生”，然后马上改搜索“达尔文”。结果后台返回了“爱迪生”的搜索结果，执行渲染逻辑后结果框展示了“爱迪生”的结果，而不是当前正在搜索的“达尔文”，这是不正确的。

**减少多余请求数**，可以用 setTimeout 函数节流的方式来处理，核心代码如下
``` html
<input id="text"></input>
<script>
    var text = document.querySelector('#text'),
        timer = null;
    text.addEventListener('keyup', (e) =>{
        // 在 250 毫秒内进行其他输入，则清除上一个定时器
        clearTimeout(timer);
        // 定时器，在 250 毫秒后触发
        timer = setTimeout(() => {
            console.log('发起请求..');
        },250)
    })
</script>
```
**已无用的请求仍然执行**的解决方式，可以在发起请求前声明一个当前搜索的状态变量，后台将搜索的内容及结果一起返回，前端判断返回数据与当前搜索是否一致，一致才走到渲染逻辑。最终代码为
``` html
<input id="text"></input>
<script>
    var text = document.querySelector('#text'),
        timer = null,
        currentSearch = '';

    text.addEventListener('keyup', (e) =>{
        clearTimeout(timer)
        timer = setTimeout(() => {
            // 声明一个当前所搜的状态变量
            currentSearch ＝ '书'; 

            var searchText = e.target.value;
            $.ajax({
                url: `search.qq.com/${searchText}`,
                success: data => {
                    // 判断后台返回的标志与我们存的当前搜索变量是否一致
                    if (data.search === currentSearch) {
                        // 渲染展示
                        render(data);
                    } else {
                        // ..
                    }
                }           
            });
        },250)
    })
</script>
```
上面代码基本满足需求，但代码开始显得乱糟糟。我们来使用 RxJS 实现上面代码功能，如下
``` javascript
var text = document.querySelector('#text');
var inputStream = Rx.Observable.fromEvent(text, 'keyup')
                    .debounceTime(250)
                    .pluck('target', 'value')
                    .switchMap(url => Http.get(url))
                    .subscribe(data => render(data));
```
可以明显看出，**基于 RxJS 的实现，代码十分简洁！**

# RxJS · 流 Stream
RxJS 是 Reactive Extensions for JavaScript 的缩写，起源于 Reactive Extensions，是一个基于可观测数据流在异步编程应用中的库。RxJS 是 Reactive Extensions 在 JavaScript 上的实现，而其他语言也有相应的实现，如 RxJava、RxAndroid、RxSwift 等。学习 RxJS，我们需要从可观测数据流(Streams)说起，它是 Rx 中一个重要的数据类型。

**流**是在时间流逝的过程中产生的一系列事件。它具有时间与事件响应的概念。

![rxjs_stream](https://cloud.githubusercontent.com/assets/10385585/19881194/bd78ec98-a03e-11e6-9a3d-155fcbd3ba35.gif)

下雨天时，雨滴随时间推移逐渐产生，下落时对水面产生了水波纹的影响，这跟 Rx 中的流是很类似的。而在 Web 中，雨滴可能就是一系列的鼠标点击、键盘点击产生的事件或数据集合等等。

# RxJS 基础实现原理简析

对流的概念有一定理解后，我们来讲讲 RxJS 是怎么围绕着流的概念来实现的，讲讲 RxJS 的基础实现原理。RxJS 是基于观察者模式和迭代器模式以函数式编程思维来实现的。

## 观察者模式
观察者模式在 Web 中最常见的应该是 DOM 事件的监听和触发。

- **订阅**：通过 addEventListener 订阅 document.body 的 click 事件。
- **发布**：当 body 节点被点击时，body 节点便会向订阅者发布这个消息。

``` javascript
document.body.addEventListener('click', function listener(e) {
    console.log(e);
},false);

document.body.click(); // 模拟用户点击
```
将上述例子抽象模型，并对应通用的观察者模型

![2016-11-01 9 53 52](https://cloud.githubusercontent.com/assets/10385585/19889545/58dababe-a070-11e6-8e54-be78121f9ba1.png)


## 迭代器模式
迭代器模式可以用 JavaScript 提供了 Iterable Protocol 可迭代协议来表示。Iterable Protocol 不是具体的变量类型，而是一种可实现协议。JavaScript 中像 Array、Set 等都属于内置的可迭代类型，可以通过 iterator 方法来获取一个迭代对象，调用迭代对象的 next 方法将获取一个元素对象，如下示例。

``` javascript
var iterable = [1, 2];

var iterator = iterable[Symbol.iterator]();

iterator.next(); // => { value: "1", done: false}
iterator.next(); // => { value: "2", done: false}

iterator.next(); // => { value: undefined, done: true}
```
元素对象中：value 表示返回值，done 表示是否已经到达最后。

遍历迭代器可以使用下面做法。

``` javascript
var iterable = [1, 2];
var iterator = iterable[Symbol.iterator]();

var iterator = iterable();

while(true) {
    try {
        let result = iterator.next();  // <= 获取下一个值
    } catch (err) {
        handleError(err);  // <= 错误处理
    }
    if (result.done) {
        handleCompleted();  // <= 无更多值（已完成）
        break;
    }
    doSomething(result.value);
}
```

主要对应三种情况：

- 获取下一个值
调用 next 可以将元素一个个地返回，这样就支持了返回多次值。

- 无更多值(已完成)
当无更多值时，next 返回元素中 done 为 true。

- 错误处理
当 next 方法执行时报错，则会抛出 error 事件，所以可以用 try catch 包裹 next 方法处理可能出现的错误。

## RxJS 的观察者 + 迭代器模式
RxJS 中含有两个基本概念：Observables 与 Observer。Observables 作为被观察者，是一个值或事件的流集合；而 Observer 则作为观察者，根据 Observables 进行处理。
Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下：

- **订阅**：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
- **发布**：Observable 通过回调 next 方法向 Observer 发布事件。

下面为 Observable 与 Observer 的伪代码
```javascript
// Observer
var Observer = {
    next(value) {
        alert(`收到${value}`);
    }
};

// Observable
function Observable (Observer) {
    setTimeout(()=>{
        Observer.next('A');
    },1000)
}

// subscribe
Observable(Observer);
```

上面实际也是观察者模式的表现，那么迭代器模式在 RxJS 中如何体现呢？

在 RxJS 中，Observer 除了有 next 方法来接收 Observable 的事件外，还可以提供了另外的两个方法：error() 和 complete()，与迭代器模式一一对应。

``` javascript
var Observer = {
    next(value) { /* 处理值*/ },
    error(error) { /* 处理异常 */ },
    complete() { /* 处理已完成态 */ }
};
```

结合迭代器 Iterator 进行理解：

- **next()**
Observer 提供一个 next 方法来接收 Observable 流，是一种 push 形式；而 Iterator 是通过调用 iterator.next() 来拿到值，是一种 pull 的形式。

- **complete()**
当不再有新的值发出时，将触发 Observer 的 complete 方法；而在 Iterator 中，则需要在 next 的返回结果中，当返回元素 done 为 true 时，则表示 complete。

- **error()**
当在处理事件中出现异常报错时，Observer 提供 error 方法来接收错误进行统一处理；Iterator 则需要进行 try catch 包裹来处理可能出现的错误。

下面是 Observable 与 Observer 实现观察者 + 迭代器模式的伪代码，数据的逐渐传递传递与影响其实就是流的表现。
``` javascript
// Observer
var Observer = {
    next(value) {
        alert(`收到${value}`);
    },
    error(error) {
        alert(`收到${value}`);
    },
    complete() {
        alert("complete");
    },
};

// Observable
function Observable (Observer) {
    [1,2,3].map(item=>{
        Observer.next(item);
    });

    Observer.complete();
    // Observer.error("error message");
}

// subscribe
Observable(Observer);
```

# RxJS 基础实现

有了上面的概念及伪代码，那么在 RxJS 中是怎么创建 Observable 与 Observer 的呢?

### 创建 Observable

RxJS 提供 create 的方法来自定义创建一个 Observable，可以使用 next 来发出流。

``` javascript
var Observable = Rx.Observable.create(observer => {
    observer.next(2);
    observer.complete();
    return  () => console.log('disposed');
});
``` 

### 创建 Observer

Observer 可以声明 next、err、complete 方法来处理流的不同状态。

``` javascript
var Observer = Rx.Observer.create(
    x => console.log('Next:', x),
    err => console.log('Error:', err),
    () => console.log('Completed')
);
``` 
最后将 Observable 与 Observer 通过 subscribe 订阅结合起来。

``` javascript
var subscription = Observable.subscribe(Observer);
``` 

RxJS 中流是可以被取消的，调用 subscribe 将返回一个 subscription，可以通过调用 subscription.unsubscribe() 将流进行取消，让流不再产生。

看了起来挺复杂的？换一个实现形式：

``` javascript
// @Observables 创建一个 Observables
var streamA = Rx.Observable.of(2);

// @Observer streamA$.subscribe(Observer)
streamA.subscribe(v => console.log(v));
```

将上面代码改用链式写法，代码变得十分简洁：

``` javascript
Rx.Observable.of(2).subscribe(v => console.log(v));
```

# RxJS · Operators 操作

## Operators 操作·入门

``` javascript
Rx.Observable.of(2).subscribe(v => console.log(v));
```

上面代码相当于创建了一个流(2)，最终打印出2。那么如果想将打印结果翻倍，变成4，应该怎么处理呢？

**方案一?**： 改变事件源，让 Observable 值 X 2

``` javascript
Rx.Observable.of(2 * 2 /* <= */).subscribe(v => console.log(v));
``` 

**方案二?**： 改变响应方式，让 Observer 处理 X 2

``` javascript
Rx.Observable.of(2).subscribe(v => console.log(v * 2 /* <= */));
``` 

**优雅方案**： RxJS 提供了优雅的处理方式，可以在事件源(Observable)与响应者(Observer)之间增加操作流的方法。

``` javascript
Rx.Observable.of(2)
             .map(v => v * 2) /* <= */
             .subscribe(v => console.log(v));
``` 

map 操作跟数组操作的作用是一致的，不同的这里是将流进行改变，然后将新的流传出去。在 RxJS 中，把这类操作流的方式称之为 Operators(操作)。RxJS提供了一系列 Operators，像map、reduce、filter 等等。操作流将产生新流，从而保持流的不可变性，这也是 RxJS 中函数式编程的一点体现。关于函数式编程，这里暂不多讲，可以看看另外一篇文章 [《谈谈函数式编程》](https://github.com/joeyguo/blog/issues/10)

到这里，我们知道了，流从产生到最终处理，可能经过的一些操作。即 RxJS 中 Observable 将经过一系列 Operators 操作后，到达 Observer。

``` javascript
          Operator1   Operator2
Observable ----|-----------|-------> Observer
```


## 一系列的 Operators 操作

RxJS 提供了非常多的操作，像下面这些。

``` javascript
Aggregate,All,Amb,ambArray,ambWith,AssertEqual,averageFloat,averageInteger,averageLong,blocking,blockingFirst,blockingForEach,blockingSubscribe,Buffer,bufferWithCount,bufferWithTime,bufferWithTimeOrCount,byLine,cache,cacheWithInitialCapacity,case,Cast,Catch,catchError,catchException,collect,concatWith,Connect,connect_forever,cons,Contains,doAction,doAfterTerminate,doOnComplete,doOnCompleted,doOnDispose,doOnEach,doOnError,doOnLifecycle,doOnNext,doOnRequest,dropUntil,dropWhile,ElementAt,ElementAtOrDefault,emptyObservable,fromNodeCallback,fromPromise,fromPublisher,fromRunnable,Generate,generateWithAbsoluteTime,generateWithRelativeTime,Interval,intervalRange,into,latest (Rx.rb version of Switch),length,mapTo,mapWithIndex,Materialize,Max,MaxBy,mergeArray,mergeArrayDelayError,mergeWith,Min,MinBy,multicastWithSelector,nest,Never,Next,Next (BlockingObservable version),partition,product,retryWhen,Return,returnElement,returnValue,runAsync,safeSubscribe,take_with_time,takeFirst,TakeLast,takeLastBuffer,takeLastBufferWithTime,windowed,withFilter,withLatestFrom,zipIterable,zipWith,zipWithIndex
```

关于每一个操作的含义，可以查看[官网](http://reactivex.io/documentation/operators.html)进行了解。下面将举几个例子。

**of**
of 可以将普通数据转换成流式数据 Observable。如上面的 Rx.Observable.of(2)。

**fromEvent**
除了数值外，RxJS 还提供了关于事件的操作，fromEvent 可以用来监听事件。当事件触发时，将事件 event 转成可流动的 Observable 进行传输。下面示例表示：监听文本框的 keyup 事件，触发 keyup 可以产生一系列的 event Observable。
``` javascript
var text = document.querySelector('#text');
Rx.Observable.fromEvent(text, 'keyup')
             .subscribe(e => console.log(e));
```

**map**
map 方法跟我们平常使用的方式是一样的，不同的只是这里是将流进行改变，然后将新的流传出去。上面示例已有涉及，这里不再多讲。 

``` javascript
Rx.Observable.of(2)
             .map(v => 10 * v)
             .subscribe(v => console.log(v));
```

Rx 提供了许多的操作，为了更好的理解各个操作的作用，我们可以通过一个可视化的工具 [marbles 图](http://rxmarbles.com/) 来辅助理解。如 map 方法对应的 marbles 图如下

![map](https://cloud.githubusercontent.com/assets/10385585/19889586/9af9d4ca-a070-11e6-8582-8dbdcfcef520.png)

箭头可以理解为时间轴，上面的数据经过中间的操作，转变成下面的模样。

**mergeMap**
mergeMap 也是 RxJS 中常用的接口，我们来结合 marbles 图(flatMap(alias))来理解它

![rxjs_flatmap](https://cloud.githubusercontent.com/assets/10385585/19889614/cb4bed20-a070-11e6-9de0-7f04d8de53cc.png)

上面的数据流中，产生了新的分支流(流中流)，mergeMap 的作用则是将分支流调整回主干上，最终分支上的数据流都经过主干的其他操作，其实也是将流中流进行扁平化。

**switchMap**
switchMap 与 mergeMap 都是将分支流疏通到主干上，而不同的地方在于 switchMap 只会保留最后的流，而取消抛弃之前的流。

除了上面提到的 marbles，也可以 ASCII 字符的方式来绘制可视化图表，下面将结合 Map、mergeMap 和 switchMap 进行对比来理解。

```
@Map             @mergeMap            @switchMap
                         ↗  ↗                 ↗  ↗
-A------B-->           a2 b2                a2 b2  
-2A-----2B->          /  /                 /  /  
                    /  /                 /  /
                  a1 b1                a1 b1
                 /  /                 /  /
                -A-B----------->     -A-B---------->
                --a1-b1-a2-b2-->     --a1-b1---b2-->
```

mergeMap 和 switchMap 中，A 和 B 是主干上产生的流，a1、a2 为 A 在分支上产生，b1、b2 为 B 在分支上产生，可看到，最终将归并到主干上。switchMap 只保留最后的流，所以将 A 的 a2 抛弃掉。

**debounceTime**
debounceTime 操作可以操作一个时间戳 TIMES，表示经过 TIMES 毫秒后，没有流入新值，那么才将值转入下一个操作。

![rxjs_debounce](https://cloud.githubusercontent.com/assets/10385585/19889647/f6ce3aac-a070-11e6-8a35-b04f05afbe36.png)

RxJS 中的操作符是满足我们以前的开发思维的，像 map、reduce 这些。另外，无论是 marbles 图还是用 ASCII 字符图这些可视化的方式，都对 RxJS 的学习和理解有非常大的帮助。

# 使用 RxJS 一步步实现搜索示例

RxJS 提供许多创建流或操作流的接口，应用这些接口，我们来一步步将搜索的示例进行 Rx 化。

使用 RxJS 提供的 fromEvent 接口来监听我们输入框的 keyup 事件，触发 keyup 将产生 Observable。
``` javascript
var text = document.querySelector('#text');
Rx.Observable.fromEvent(text, 'keyup')
             .subscribe(e => console.log(e));
```
这里我们并不想输出事件，而想拿到文本输入值，请求搜索，最终渲染出结果。涉及到两个新的 Operators 操作，简单理解一下：

- **pluck('target', 'value')**
将输入的 event，输出成 event.target.value。

- **mergeMap()**
将请求搜索结果输出回给 Observer 上进行渲染。

``` javascript
var text = document.querySelector('#text');
Rx.Observable.fromEvent(text, 'keyup')
             .pluck('target', 'value') // <--
             .mergeMap(url => Http.get(url)) // <--
             .subscribe(data => render(data))
```
上面代码实现了简单搜索呈现，但同样存在一开始提及的两个问题。那么如何减少请求数，以及取消已无用的请求呢？我们来了解 RxJS 提供的其他 Operators 操作，来解决上述问题。

- **debounceTime(TIMES)**
表示经过 TIMES 毫秒后，没有流入新值，那么才将值转入下一个环节。这个与前面使用 setTimeout 来实现函数节流的方式有一致效果。

- **switchMap()** 
使用 switchMap 替换 mergeMap，将能取消上一个已无用的请求，只保留最后的请求结果流，这样就确保处理展示的是最后的搜索的结果。

最终实现如下，与一开始的实现进行对比，可以明显看出 RxJS 让代码变得十分简洁。
``` javascript
var text = document.querySelector('#text');
Rx.Observable.fromEvent(text, 'keyup')
             .debounceTime(250) // <- throttling behaviour
             .pluck('target', 'value')
             .switchMap(url => Http.get(url)) // <- Kill the previous requests
             .subscribe(data => render(data))
``` 

# 总结
本篇作为 RxJS 入门篇到这里就结束，关于 RxJS 中的其他方面内容，后续再拎出来进一步分析学习。
RxJS 作为一个库，可以与众多框架结合使用，但并不是每一种场合都需要使用到 RxJS。复杂的数据来源，异步多的情况下才能更好凸显 RxJS 作用。

查看更多文章>> https://github.com/joeyguo/blog/issues
