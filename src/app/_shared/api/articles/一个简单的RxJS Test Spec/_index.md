# 一个简单的RxJS Test spec

## 写作原因：
Testing可以帮助深入了解RxJS。   
RxJS文档中没有说明如何创建测试环境，也没有完整的测试示例repo供参考。  
此外，hot, cold两个helper function，在rxjs/src/testing里面找不到。其实是要用TestScheduler.createHot|ColdObservable。  
在`new TestScheduler`的时候需要一个assertDeepEqual，rxjs没有提供。  
而且，在[Writing Marble Tests][] (下文简称testDoc)中，有一句：
> The TestScheduler will **_automatically_** flush at the end of your jasmine it block.  

实际上并非如此，至少我是需要在it block最后手动`scheduler.flush();`。

## 参考：
1. [Writing Marble Tests][]
2. [interval operator文档][]
3. [interval operator源码测试][]
4. [rxjs/src/testing源码][]

## 相关基本概念：
* observer: 是一个Object，有3个callback function，形如

        {
          next: functionNext, 
          error: functionError, 
          complete: functionComplete
        }
    。error和complete不是必要的，即只有next的`{next: functionNext}`也是一个合法的observer。
* observable： 主要任务是在某个时间点，调用observer的某个callback，并传送数据（数据可以是null, undefined）。  
    下面的observable会在0 ms的时候，传送`1`并调用observer.next，在20 ms(不准确，姑且认为是在20 ms)的时候，传送`'a'`并调用observer.next，以此类推。  
    可以认为observable是一个function，以observer为参数，在observable里面会调用observer的callback，同时传送数据。  

        observable = (observer) => {
          observer.next(1);
          setTimeout(()=> {observer.next('a'), 20}
          setTimeout(()=> {observer.next({x: 6}), 40}
          setTimeout(()=> {observer.next([3, 5]), 80}
          setTimeout(()=> {observer.complete()}, 80)
        }  
    当然，实际的observable的构造要复杂得多，而且调用observable并不是以observable(observer)的方式，  
    而是以observable.subscribe(observer)的方式，即在subscribe()之后，observable开始运作。

* TestScheduler: 是一个虚拟时间机器。Observable可以挂靠并运行在这个虚拟时间机器上，像上面这个80 ms的observable，可以在一瞬间完成。  
    挂靠方式是在创建observable的时候，将TestScheduler作为observable的一个参数。
* Marble String: 一个observable的数据传递，可以用marble string来表达。
    上面的observable用marble string写出来就是：  
    `'a-b-c---(d|)', value: {a: 1, b: 'a', c: {x: 6}, d: [3, 5]}`  
    marble string的最小时间单位是10 frames（虚拟时间，相当于10 ms），即string上面的1个字符占用10 frames。  
    `-`代表什么都没发生；`字母`代表一个数据；`|`代表`complete`；`()`代表同时，`(d|)`即数`d`和`complete`同时发生；`#`代表`error`；`^`代表起始（后续文章中会对`^`详细说明）。values是每个字母对应的具体数据。  

## 运行示例测试：
1. Clone the repo: [rxjs-typescript-starter][]  
    该repo的dependencies中包含：rxjs, webpack, typescript, jasmine, karma。  
2. 在src文件夹下，创建*.spec.ts文件。
    比如[index.spec.ts][]包含下面代码：  

        import { Observable, TestScheduler } from 'rxjs';
        describe('Observable.interval', () => {
          it('should emit the first value at timeFrame x (x is the interval)', () => {
            const scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
            const values = {a: 0, b: 1, c: 2, d: 3}
            const expectedStream = '--a-b-c-(d|)'
            const $ToTest$ = Observable.interval(20, scheduler).take(4)
            scheduler.expectObservable($ToTest$).toBe(expectedStream, values)
            scheduler.flush();
          })
        })  

3. 在命令行运行`npm test`。  

## 示例代码说明：
testDoc提到4条Basic Method。这里先接触一下`expectObservable(actual: Observable<T>).toBe(marbles: string, values?: object, error?: any)`。

回到index.spec.ts示例。  
1. new一个TestScheduler，并传入一个assertDeepEqual，这里用的是jasmine的toEqual。（为什么这么设计？为什么rxjs自己不带一个？）  
2. 构建expected marble string，用expectedStream加上values。  
3. 接下来定义我们要测试的observable为`$ToTest$`，并挂上TestScheduler。  
4. 然后用`scheduler.expectObservable($ToTest$)`将`$ToTest$`转换为marble string，并用toBe与expeted marble sring对比。  
5. `scheduler.flush();`启动虚拟时间机器。  
运行`npm test`，看到`Executed 1 of 1 SUCCESS`。  
更改values的数据，比如`d:4`，之后，看到`Executed 1 of 1 (1 FAILED) ERROR`，以及一长串`Expected [...] to equal [...]`。  
Array里面是这样的：  
`Object({ frame: 20, notification: Notification({ kind: 'N', value: 0, exception: undefined, hasValue: true }) })`  
意思就是在frame 20的时候，传递的数据是`0`。  
然后找找到底是哪里导致了`Executed 1 of 1 (1 FAILED) ERROR`。

## 结尾
现在，我们可以运行RxJS的测试了。  
在[operator文档][]页面，每个operator下面，都有一个源码测试的链接。比如，本文开头参考部分的第3项。  
可以将源码测试内容略微修改，在我们的testing environment里面运行，更改数据，使测试报错，然后分析原因，这样可以更细致的了解operator的用途，并验证自己对某个operator的理解。  


[interval operator文档]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-interval
[Writing Marble Tests]: https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md
[interval operator源码测试]: http://reactivex.io/rxjs/test-file/spec-js/observables/interval-spec.js.html
[rxjs-typescript-starter]: https://github.com/rxjs-space/rxjs-typescript-starter
[index.spec.ts]: https://github.com/rxjs-space/rxjs-typescript-starter/blob/master/src/index.spec.ts
[rxjs/src/testing源码]: https://github.com/ReactiveX/rxjs/tree/master/src/
[operator文档]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html