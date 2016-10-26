# 一个简单的RxJS Test Spec

## 写作原因：
Testing除了可以帮助我们远离bug以外，也能帮我们了解小到一段陌生的代码大到一个陌生的库是如何运转的。  
这一点同样适用于RxJS。  
那么，一个RxJS的Test Spec该怎么写？Spec写好了，该怎么运行呢？  
关于这个过程官方文档中暂时没有的完整的介绍。  
而本文提到的测试环境搭建与spec编写方法，是笔者通过各种尝试摸索出来的。  
难免出错，仅供参考，并希望以此抛砖引玉。  

## Testing就是Assertion
Testing要做的事情就是Assertion：比较**我们的代码生成的结果**与**我们期望的结果**。    
比如：`expect(我们的代码生成的结果).toBe(我们期望的结果)`。  
具体到RxJS，我们要测试的其实是Observable，比如：  
`expectObservable(我们的Observable$).toBe(一个什么东西)` 。    

[RxJS Repo的Spec目录][]里，有详尽的Unit Test Spec。  
我们来看一下[interval operator的spec][]： 

    describe('Observable.interval', () => {
      it('should create an observable emitting periodically', () => {
        const e1 = Observable.interval(20, rxTestScheduler)
          .take(6) // make it actually finite, so it can be rendered
          .concat(Observable.never()); // but pretend it's infinite by not completing
        const expected = '--a-b-c-d-e-f-';
        const values = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, };
        expectObservable(e1).toBe(expected, values);
      });
      // ...
    })

即使你不知道什么是Observable，也不知道这个interval这个operator是做什么的，但通过上面的代码，你大概能猜到：   
expected里面的字符会被values里面的对应的数值替换掉，  
同时我们期望*e1*这个Observable与*加载了values的expected*等价。  

接下来，我们先说相关概念，然后是简略的测试环境搭建，最后是分析上面这段代码。 

大家也可以下先看一下官方的[Writing Marble Tests][]，然后再听我唠叨。  

## 相关概念
以下为粗略理解，详情参见[官方文档][]。  
* Observer：  
    一个Object，可以有3种callback，形如`{next: nextFn, error: errorFn: complete: completeFn}`。  
    3个callback都不是必要的，`{next: nextFn}`, `{next: undefined, error: errorFn}`甚至`{}`（空object）都是合法的Observer。  
    &#8194;  

* Observable：  
    定义在某个时点（可以根据时钟，也可以根据事件），通过调用observer.callback来向observer推送数据。  
    比如，在Observable启动20 ms之后，调用observer.next('Hello')；或者在用户点击鼠标的时候，调用observer.next(event)；  
    或者在链接服务器出错时，调用observer.error('can not reach server')，等等。      
    * Observable.subscribe：  
      Observable定义好了以后，并不会自己运转起来，而是通过`Observable.subscribe(observer)`来启动，同时指定了observer。  
      这就像是在定义好了一个function以后，function自己不会运行，而是通过`function()`来启动。  
      &#8194;

* TestScheduler：  
    一个虚拟时间机器，Observable可以挂靠其上。  
    我们定义的Observable在真实环境下可能要跑上一段时间才结束。而在TestScheduler里，就是一个同步的执行。    
    比如`Observable.interval(20).take(20)`，这个observable每隔20 ms推送一个递增数字，一共推20个，需要用时400 ms。  
    通过`Observable.interval(20, testScheduler).take(20)`（testScheduler是TestScheduler的一个instance），  
    来设定Observable运行在虚拟时间机器上，在测试环境下，瞬间结束。     
    * assertDeepEqual：  
      在Spec里面要new一个TestScheduler，此时需要要以一个assertDeepEqual函数作为参数。后面代码部分详解。  
      &#8194;

* Marble Diagram：  
    Observable在不同时点向外推送数据，如果用句子来表达，可以是：  
    “在0 ms时，推100；在20 ms时推'a'；40 ms，{x: 1}；60 ms，[3,5]，同时complete”等等。  
    这个过程也可以用Marble Diagram画出来，比如`'a-b-c-(d|)', {a: 100, b: 'a', c: {x: 1}, d: [3, 5]}`。  
    * `'a-b-c-(d|)'`，这部分我们暂且叫它数据时间轴，它显示的是数据在什么时间被推送，  
      一个字符占用10 frames（相当于10 ms），比如，c这个数据是在**第40 frame**时推送的。  
    * `{a: 100, b: 'a', c: {x: 1}, d: [3, 5]}`，这部分是注明每个数据具体的值。  
    * 另外，`-`代表啥都没发生；`|`代表complete；`()`代表同时，以`(`所在的时刻为准。  
      比如`(d|)`，是说`d`与`complete`同时发生在`(`所对应的时点，上面的数据时间轴里，`(`对应在**第60 frame**。  

    其他详见[Writing Marble Tests][]。

## 测试环境搭建
坦白一下，我还没弄明白RxJS开发时的测试环境是怎样搭建的，大家有兴趣可以研究一下[interval operator的spec][]的import部分。  
这里要用到的测试环境就是大家在[angular2-wepback-starter][]里看到的，jasmine + karma + webpack，以及其他相关的karma plugins。  
大家可以clone [angular2-wepback-starter][]，也可以用我的轻量化的[rxjs-typescript-starter][]。

## 代码分析
除了测试环境不同，还有一些[interval operator的spec][]用到的helper methods我也没找到。  
在粗看了[RxJS Testing源码][]之后（细看也看不懂），知道了TestScheduler有哪些method，就能大概改一改上面的spec，在我们的测试环境里跑起来。  
改过之后的spec如下，保存在index.spec.ts文件中：

    // index.spect.ts
    import { Observable, TestScheduler } from 'rxjs';

    describe('Observable.interval', () => {
      it('should create an observable emitting periodically', () => {
        const testScheduler = new TestScheduler((a, b) => expect(a).toEqual(b));  // added
        const e1 = Observable.interval(20, testScheduler)
          .take(6) // make it actually finite, so it can be rendered
          .concat(Observable.never()); // but pretend it's infinite by not completing
        const expected = '--a-b-c-d-e-f-';
        const values = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, };
        testScheduler.expectObservable(e1).toBe(expected, values);  // modified
        testScheduler.flush();  // added
      });
    })

逐条分析如下：
1. import TestScheduler
2. describe -> it ->
3. new一个TestScheduler，这里需要一个assertDeepEqual函数，TestScheduler.d.ts源码里是这样的：  
  `constructor(assertDeepEqual: (actual: any, expected: any) => boolean | void)`  
  在网上搜了一下，我们可以用jasmine的expect().toEqual()， 就是`(a, b)=> expect(a).toEqual(b)`。
4. 定义要被测试的Observable `e1`，挂上testScheduler，挂上testScheduler，挂上testScheduler。  
  至于这个一长串的Observable是个啥，我们稍后在测试输出里就能看到。
5. 定义期望的Marble Diagram，有两部分，数据时间轴`expected`以及每个数据对应的数值`values`。
6. 调用expectObserable().toBe()，这个是TestScheduler的method，写出来就是：   
  `testScheduler.expectObservable(e1).toBe(expected, values);`toBe就够了。  
  表面上看是`e1`被转换成了一个Marble Diagram，然后与*加载了values的expected*进行比较。    
  实际上是`e1`和`expected`都被转化成一个中间状态，然后比较。
7. `testScheduler.flush();`这一步是启动虚拟时间机器。  
  [Writing Marble Tests][]里有这么一句：*The TestScheduler will automatically flush at the end of your jasmine it block.*  
  真的*红外遥感，自动冲冲*吗？大家先继续本文。

然后我们`npm test`（后面跑的就是`karma start`），看到`Executed 1 of 1 SUCCESS`。这有啥用？  
我们改一下values吧，比如`f: 6`，保存，看到Executed 1 of 1 (1 FAILED) ERROR，以及一长串Expected [...] to equal [...]。  
第一个Array（我们的e1）的最后一项：  （看不清？试试[js beautifier][]）  
`Object({ frame: 120, notification: Notification({ kind: 'N', value: 5, exception: undefined, hasValue: true }) })`   
意思就是在frame 120的时候，推送的数据是5。这就是上面第6.点中提到的中间状态。    
第二个Array（加载了values的expected）的最后一项：  
`Object({ frame: 120, notification: Notification({ kind: 'N', value: 6, exception: undefined, hasValue: true }) })`  
frame 120，推送6。看到区别了吧。  
这样，我们就大概知道了那个一长串的Observable是个啥了。  
然后我们把`testScheduler.flush();`删掉，保存，看到`Executed 1 of 1 SUCCESS`，此时f对应的还是6呢，怎么就SUCCESS了？  
看来还是要*手动冲一下*。  

## 结尾

现在，我们可以编写并运行RxJS的测试了。  
本文对`Observable.interval`的测试，可以说是RxJS中最简单的测试了。  
而在实际应用中，我们构建出来的Observable会变得很复杂，对其测试也会更复杂。  
大家可以通过研究TestScheduler的构造，并借助[RxJS Repo的Spec目录][]里spec，来进一步了解RxJS。  



[Writing Marble Tests]: https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md
[官方文档]: http://reactivex.io/rxjs/manual/overview.html
[interval operator的spec]: https://github.com/ReactiveX/rxjs/blob/master/spec/observables/interval-spec.ts 
[angular2-wepback-starter]: https://github.com/AngularClass/angular2-webpack-starter
[rxjs-typescript-starter]: https://github.com/rxjs-space/rxjs-typescript-starter
[RxJS Testing源码]: https://github.com/ReactiveX/rxjs/tree/master/src/testing
[js beautifier]: http://jsbeautifier.org
[RxJS Repo的Spec目录]: https://github.com/ReactiveX/rxjs/tree/master/spec
