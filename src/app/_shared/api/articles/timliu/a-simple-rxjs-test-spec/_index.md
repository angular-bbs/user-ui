# 一个简单的RxJS Test Spec

## 写作原因：
Testing 可以帮助我们远离bug，除此以外，还能帮我们了解小到一段陌生的代码大到一个陌生的库是如何运转的。这一点同样适用于 RxJS。  
那么，一个 RxJS 的 Test Spec 该怎么写？Spec 写好了，该怎么运行呢？关于测试使用了 RxJS 的代码的过程，官方文档中暂时没有的完整的介绍。  
笔者通过各种尝试，摸索出来一套编写测试 spec 和建立测试环境的方法，在这里记录一二。难免错漏，仅供参考，并希望以此抛砖引玉。  

## 读者指引
本文使用 jasmine 测试框架，需要读者对 jasmine 的 spec 编写有一定了解。

## Testing 就是 Assertion
Testing 要做的事情就是 assertion，即比较**我们的代码生成的结果**与**我们期望的结果**。比如：  
`expect(我们的代码生成的结果).toBe(我们期望的结果)`。  
具体到 RxJS，我们要测试的是 Observable，assertion 就是：  
`expectObservable(我们的 observable).toBe(一个什么东西)` 。    

下面以RxJS Repo 里的[interval operator的spec][]作为示例：

```js
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
```

即使你不知道什么是 Observable，也不知道这个 Observable.interval 是做什么的，但通过上面的代码最后的 assertion，你大概能猜到：   
expected 里面的字符会被 values 里面的对应的数值替换掉，同时我们期望 *e1* 与 *加载了values的expected* 等价。  

接下来，我们先说相关概念，然后是简略的测试环境搭建，最后是分析上面这段代码。 

大家也可以下先看一下官方的 [Writing Marble Tests][]，然后再听我唠叨。  

## 相关概念
以下为粗略理解，大家也可以参考之前的文章《[白话 RxJS][]》，详情参见[官方文档][]。  
- Observer：一个Object，可以有3种callback，形如 `{next: nextFn, error: errorFn: complete: completeFn}`。  
- Observable：定义在某个时点（可以根据时钟，也可以根据事件），通过调用 observer.callback 来向 observer 推送数据，可以推送任意多次。  
  比如，在Observable启动20 ms之后，调用observer.next('Hello')；或者在用户点击鼠标的时候，调用 observer.next(event)；或者在链接服务器出错时，调用 observer.error('can not reach server')，等等。      
- Observable.prototype.subscribe ：Observable 在定义好了以后，并不会自己运转起来，而是通过 Observable.prototype.subscribe 来启动。
  比如，我们有一个 sampleObservable 以及一个 sampleObserver，要启动 sampleObservable，我们需要用 `sampleObservable.subscribe(sampleObserver)`。如此，sampleObservable 就开始运行了，即在定义好的时点，通过 sampleObserver.callback 推送数据。
- TestScheduler：一个虚拟时间机器，Observable可以挂靠其上。我们定义的 Observable 在真实环境下，可能要跑上一段时间才结束。而在 TestScheduler 这个虚拟时间机器里，Observable 的运行仅仅是一个同步的执行。    
  比如 `Observable.interval(20).take(20)`，这个 observable 每隔20 ms推送一个递增数字，一共推20个，需要用时400 ms。通过 `Observable.interval(20, testScheduler).take(20)`（testScheduler是TestScheduler的一个实例）， 来设定这个 observable 运行在虚拟时间机器上，在测试环境下，瞬间结束。     
- assertDeepEqual：在新建一个 TestScheduler 的实例的时候，需要传入一个 assertDeepEqual 函数，即 `const testScheduler = new TestScheduler(assertDeepEqual);`。根据 TestScheduler.d.ts 源码：assertDeepEqual 是这样一个函数：
  `assertDeepEqual: (actual: any, expected: any) => boolean | void`。字面上看，这个函数会比较两个值，看是否相等，而且是 deeply equal，即如果对比的是Object，则需要迭代的对比 Object 上的每一个属性。在网上搜了一下，我们可以用 jasmine 的 expect().toEqual()， 就是 `(a, b) => expect(a).toEqual(b)`。
- Marble Diagram：Observable 在不同时点向外推送数据，这个过程可以用文字表述，也可以用 Marble Diagram，对比着看就是这样：  
  - 文字表述：“在0 ms时，推送100；在20 ms时，推送 'a'；40 ms时，推送 '{x: 1}'；60 ms时，推送 '[3,5]'，同时 调用 observer.complete()”等等。  
  - Marble Diagram 表述：`'a-b-c-(d|)', {a: 100, b: 'a', c: {x: 1}, d: [3, 5]}`。  

  对上述 Marble Diagram 具体说明如下：
  1. 'a-b-c-(d|)'：这部分我们暂且叫它数据时间轴，它显示的是数据在什么时间被推送，一个字符占用 10 frames（相当于 10 ms），比如，c 这个数据是在*第40 frame*时推送的。  
  2. {a: 100, b: 'a', c: {x: 1}, d: [3, 5]}：这部分是注明每个数据具体的值。
  3. 另外，'-' 代表啥都没发生；'|' 代表 complete；'()' 代表同时，以 '(' 所在的时刻为准。比如 '(d|)'，是说 d 与 complete 同时发生在 '(' 所对应的时点，上面的数据时间轴里，'(' 对应在*第60 frame*。  
  4. 其他详见 [Writing Marble Tests][]。

## 测试环境搭建
坦白一下，我还没弄明白 RxJS 源码 repo 的测试环境是怎样搭建的，大家有兴趣可以研究一下[源码 repo 上的的 package.json][]。  
（我们这里是 Angular 中文社区，所以）本文的测试环境就是 [angular2-wepback-starter][] 所使用的：jasmine + karma + webpack，以及其他相关的 karma plugins。  
大家可以 git clone angular2-wepback-starter，或者用我的轻量化的 [rxjs-typescript-starter][]。

## 代码分析
在建立了测试环境以后，我们在 src 目录下新建一个 index.spec.ts 文件，并将开篇的 spec 拷入其中。可能是因为测试环境不同，这个 spec 没能在我们的环境下运行，所以还要对 spec 做一些修改。   
改过之后的spec如下：

```js
// index.spect.ts
import { Observable, TestScheduler } from 'rxjs';

describe('Observable.interval', () => {
  it('should create an observable emitting periodically', () => {
    const testScheduler = new TestScheduler((a, b) => expect(a).toEqual(b));  // 增加这一行，新建一个 testScheduler
    const e1 = Observable.interval(20, testScheduler) // 这里用我们的 testScheduler
      .take(6) // make it actually finite, so it can be rendered
      .concat(Observable.never()); // but pretend it's infinite by not completing
    const expected = '--a-b-c-d-e-f-';
    const values = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, };
    testScheduler.expectObservable(e1).toBe(expected, values);  // 这里也是用我们的 testScheduler
    testScheduler.flush();  // 增加这一行，用来启动 testScheduler 这个虚拟时间机器
  });
})
```

逐条分析如下：
1. import TestScheduler
2. describe -> it ->
3. 创建 TestScheduler 实例，命名这个实例为 testScheduler，这个过程在上面的“相关概念 / assertDeepEqual”一节有提到。
4. 定义要被测试的 Observable 'e1'，挂上 testScheduler，挂上 testScheduler，挂上 testScheduler。 e1 构建使用了 interval、take、concat、never 等运算符，先不必清楚这个 e1 具体长什么样，稍后会在测试输出里看到。
5. 定义期望的 Marble Diagram，有两部分，数据时间轴 'expected' 以及每个数据对应的数值 'values'。
6. 调用 expectObserable().toBe()，这个是 TestScheduler的 method，写出来就是：   
  `testScheduler.expectObservable(e1).toBe(expected, values);`。  
  表面上看是 'e1' 被转换成了一个 Marble Diagram，然后与 *加载了 values 的 expected* 进行比较。实际上是 'e1' 和 'expected' 都被转化成一个中间状态，然后再进行比较。
7. `testScheduler.flush();`这一步是启动虚拟时间机器。[Writing Marble Tests][]里有这么一句：
    > The TestScheduler will automatically flush at the end of your jasmine 'it' block.  

    真的是*红外遥感，自动冲冲*吗？大家先继续本文。

然后我们 'npm test'（后面跑的就是 'karma start'），看到 'Executed 1 of 1 SUCCESS'。这有啥用？我们来让这个 spec fail掉，看看会有什么发现。    
改一下 values，比如 'f: 6'，保存，看到 'Executed 1 of 1 (1 FAILED) ERROR'，以及一长串 'Expected [...] to equal [...]'。  
第一个Array（我们的 'e1'）的最后一项：  （Array太长了看不清？试试[js beautifier][]）  
`Object({ frame: 120, notification: Notification({ kind: 'N', value: 5, exception: undefined, hasValue: true }) })`   
意思就是在frame 120的时候，推送的数据是5。这个 Object 就是上面第6点中提到的中间状态。    
第二个Array（加载了 'values' 的 'expected'）的最后一项：  
`Object({ frame: 120, notification: Notification({ kind: 'N', value: 6, exception: undefined, hasValue: true }) })`  
frame 120，推送6。看到区别了吧。  
这样，根据第一个 Array，我们就知道了 e1 是一个什么样的 observable 了，而且可以通过更改 spec 去了解构建 e1 时候用到的运算符大概有什么功能了。

然后我们把 'testScheduler.flush();' 删掉，保存，看到 'Executed 1 of 1 SUCCESS'，此时f对应的还是6呢，怎么会 SUCCESS 呢？看来还是要*手动冲一下*。  

## 总结
如果要测试应用了 RxJS 的代码，我们需要：  
- 测试环境：jasmine + karma + webpack。
- spec 编写： 新建 TestScheduler 实例，将被测试的 Observable 挂上 testScheduler，描述期望的 Marble Diagram，调用 expectObservable().toBe()，flush 一下。

本文只涉及了 RxJS 测试的皮毛。[RxJS Repo的Spec目录][]里，有详尽的 Unit Test Spec。要不要去 fail 几个？

## 参考
- [interval operator的spec][]
- [RxJS Testing源码][]
- [RxJS Repo的Spec目录][]
- [Writing Marble Tests][]
- [官方文档][]
- [白话 RxJS][]

[Writing Marble Tests]: https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md
[白话 RxJS]: https://wx.angular.cn/library/article/simple-rxjs
[源码 repo 上的的 package.json]: https://github.com/ReactiveX/rxjs/blob/master/package.json
[官方文档]: http://reactivex.io/rxjs/manual/overview.html
[interval operator的spec]: https://github.com/ReactiveX/rxjs/blob/master/spec/observables/interval-spec.ts 
[angular2-wepback-starter]: https://github.com/AngularClass/angular2-webpack-starter
[rxjs-typescript-starter]: https://github.com/rxjs-space/rxjs-typescript-starter
[RxJS Testing源码]: https://github.com/ReactiveX/rxjs/tree/master/src/testing
[js beautifier]: http://jsbeautifier.org
[RxJS Repo的Spec目录]: https://github.com/ReactiveX/rxjs/tree/master/spec
