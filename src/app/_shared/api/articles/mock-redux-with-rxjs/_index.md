初稿日期：2016年10月25日

## 变量名Style约定
（这是我个人的Style约定，并非任何Best Practice。）
* `Observable`变量以`$`结尾，如`state$`；  
* `Subject`变量以`$$`结尾， 如`state$$`；  
* `Subscription`变量以`_`结尾，如`ultimate_`。 

## 写作原因/目的
大家可能听过或是正在用[redux][]这个库。    
示例（拷贝过来的，他们不打";"）：  
```js
import { createStore } from 'redux'

// 这个是Reducer函数，a pure function
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

let store = createStore(counter)

store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch({ type: 'INCREMENT' }) // will log 1 on the console
```
应用redux，我们不再直接修改`state`，而是把`state`存放在一个`store`里面，通过`store.dispatch(action)`来发送`action`，  
这个`action`会触发一个`Reducer`函数，这个`Reducer`函数依据`action`来改变`state`，  
而后，再用`store.subscribe(responseFn)`启动store的运转，  
每次state变化，都会触发`responseFn`，上面示例中，每次`state`变化，都会触发`() => console.log(store.getState()`，  
而`store.getState()`就是最新的`state`。  

注意：这里有个`subscribe()`哦，那么，`store`是不是一个`Observable`呢？  
再来看看redux的`package.json`，里面有RxJS哦。    
如此，可以大体断定，redux在实现State Store功能的过程中，用到了RxJS。  

那么我们能不能直接用RxJS来直接实现State Store的功能呢？   
RxJS的文档里就有答案，就在这里：[RxJS官方教程 - State Stores][]。   

本文将先介绍一些RxJS的基本概念， 而后，依据官方State Stores示例，并引入`Subject`，来实现开头部分redux示例中的功能。  
水平所限，难免有错漏，请大家多指教。另外，我写的比较啰嗦，请大家多包涵。  

## 相关概念
以下为粗略理解，具体参见[官方文档][]。  

1. `Observer`：是一个Object，里面有3个Callback，形如`{next: nextFn, error: errorFn, complete: completeFn}`。   
  3个Callback都不是必须的。   
  示例：
      ```js
      const observer = {next: (v) => console.log(v)}; // 这个Observer只有next callback
      ```

2. `Observable`：定义在某个时点通过调用`observer.callback(v)`（比如`observer.next(v)`）将数据`v`推送给`observer`；  
  `Observable`不会自动运行，而是要通过`subscribe`方法来启动，  
  比如，`observable.subscribe(observer)`就是启动`observable`，同时指定`observer`为数据推送对象；  
  注意：即使不向`subscribe`传送任何参数，也是可以启动`observable`的，即`observable.subscribe()`就能启动`observable`。  
  示例：  
    ```js
    const observable$ = Observable.create((observer) => {
      observer.next(0); 
      setTimeout(()=>observer.next(1), 10);
      // ...
    } // 创建一个Observable，在observable$启动后，time 0的时候推送数据0, 并调用observer.next；在time 10的时候推送数据1，...。
    // 创建Observable的方式有很多，Observable.create只是其中一种。

    observable$.subscribe(observer); // 启动observable，并指定数据传给observer。
    // observable$.subscribe({next: nextFn}) 可以简写成 observable$.subscribe(nextFn)
    ```

3. `Subject`：既是一个`Observer`（有`next` Callback，即`subject.next(v)`），又是一个`Observable`（有`subscribe`方法，即`subject.subcribe(observer)`）。   
  示例：  
    ```js
    const subject$$ = new Subject(); // 创建一个Subject
    observable$.subscribe(subject$$); // 因为subject$$是一个observer，我们可以用subject$$来订阅observable$
    subject$$.subscribe(observer); // 因为subject$$也是一个observable，它可以被别的observer订阅
    ```

4. `BehaviorSubject`：是一个`Subject`，能留存最后一个数据；创建时需指定初始数据；  
  可以通过`getValue()`获取留存的最后一个数据。（RxJS version 5文档中没提`getValue`方法）   
  示例：  
    ```js 
    const subjectB$$ = new BehaviorSubject(9); // 创建一个BehaviorSubject, 需要一个初始值
    subjectB$$.subscribe(observable); // 订阅一个BehaviorSubject，会把当前数据立即推送给observer
    console.log(subjectB$$.getValue()); // getValue()获取留存的最后一个数据
    ```
    
5. [scan运算符][]：如果把Observable推送的数据流类比成Array的话，那么Observable.prototype.scan运算符就类似Array.prototype.reduce，  
  不同在于Array.prototype.reduce是把Array中所有的数值累积后形成一个值，而Observable.prototype.scan是把当前值和之前的累积值再次累积形成一个值，参见示例：  
    ```js
    observable$.scan((accumulated, current) => accumulated + current, 0);
    // 类似Array.prototype.reduce，比如：[1, 2, 3].reduce((acc, curr) => acc + curr, 0);
    ```  

## 编写代码  

Repo：
以下代码可以在这个[repo][]里找到。
 
主演：  
1. `action$$`：一个`Subject`，负责转推`action`（转推，就是外部推给它，它再推出去）。
2. `state$$`：一个`BehaviorSubject`，负责转推`state`，并存储最后一个`state`，即最近跟新的`state`。

故事梗概：  
1. 外部通过`action$$.next(action)`将`action`推送给`action$$`，这个“外部”可以是个定时器、DOM事件或是Http请求的返回；  
2. `action$$`在转推的时候，`action`被映射（“映射”指的就是`map`）成`changeFn`；   
3. `changeFn`被那啥（“那啥”指的就是`scan`）成`state`；  
4. `state`再被推给`state$$`；  
5. `state$$`再将`state`转推给`console.log`。   

比如，外部推`INCREASE`给`action$$`，`INCREASE`被`map`成一个`changeFn`，即`(state)=>state+1`，这个`changeFn`被`scan`成一个新的`state`，  
如果上一个`state`是`0`的话，根据`changeFn`，这个新的`state`就是`1`，这个`state`再被推给`state$$`，再转推给`console.log`。  

为什么不直接将`action`映射成`state`，而是将`action`映射成`changeFn`呢？  
如果要把`action`映射成`state`，每次映射操作都要通过`state$$.getValue()`来获取`currentState`，这就像在一个`function`里面使用一个全局变量。   
而将`action`映射成`changeFn`，映射过程没有外部变量，更容易测试。   


代码：  

```js
/*
  定义interfaces, types。
  定义INCREASE, DECREASE两个常数，这样，后面可以用INCREASE变量来代替'INCREASE'字符串，避免typo。
*/
type ActionType = 'INCREASE' | 'DECREASE';
interface Action {
  type: ActionType;
}
const INCREASE: ActionType = 'INCREASE';
const DECREASE: ActionType = 'DECREASE';
type State = number;
type ChangeFn = (state: State) => State;

/*
 创建action$$，负责转推action。
 创建state$$，负责转推state，并留存最近的state，初始值为0。
 立即用console.log订阅到state$$，这样避免漏数据。
 在console.log订阅到state$$之后，state$$会立即将留存的state推给console.log，在console上看到0。
*/
const action$$: Subject<Action> = new Subject();
const state$$: BehaviorSubject<State> = new BehaviorSubject(0);
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

/*
  changeFn$将action "map成" changeFn。
  changeFn$不会自动运行。
*/
const changeFn$: Observable<ChangeFn> = action$$
  .map((action: Action) => {
    switch (action.type) {
      case INCREASE:
        return (state: State) => state + 1;
      case DECREASE:
        return (state: State) => state - 1;
      default:
        return (state: State) => state;
    }
  })

/*
  state$将changeFn "scan成" state，state初始为state$$的当前数值，即state$$.getValue()。
  state$不会自动运行。
*/
const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), 0);

/*
  用state$$订阅state$，state$开始运行，并向state$$推送数据，state$$再转推给console.log
*/
const intermediate_: Subscription = state$.subscribe(state$$);

/*
  用action$$.next()来向action$$推送action；
  这个action会经过map，scan变成一个state，然后被推给state$$，然后推给console.log
*/
action$$.next({type: INCREASE}); // 1
action$$.next({type: INCREASE}); // 2
action$$.next({type: DECREASE}); // 1

/*
  获取最近的state，用BehaviorSubject.getValue()
*/
console.log(state$$.getValue());    // current state is 1

/*
  我们再用DOM事件来向action$$推送action。
  先创建两个按钮。
*/
const section = document.createElement('section');
document.body.appendChild(section);
const incButton = document.createElement('button');
incButton.innerText = INCREASE;
section.appendChild(incButton);
const decButton = document.createElement('button');
decButton.innerText = DECREASE;
section.appendChild(decButton);


/*
  创建click事件Observable，定义每次点按会推送一个action给action$$。
  而后合并所有的click$至一个observable，并用subscribe()启动运行。
*/
const incButtonClick$ = Observable.fromEvent(incButton, 'click')
  .map(() => action$$.next({type: INCREASE}));
const decButtonClick$ = Observable.fromEvent(decButton, 'click')
  .map(() => action$$.next({type: DECREASE}));

const clicks_ = Observable.merge(incButtonClick$, decButtonClick$)
  .subscribe(); // 这里不需要像subscribe()传递任何参数
```

## 总结
这样，是不是就可以不用装redux了？  
  
希望通过此文，能够帮助大家进一步了解RxJS，尤其是其中的Subject和scan运算符。


## 参考
[redux][]  
[RxJS官方教程 - State Stores][]  
[官方文档][]
[scan运算符][]



**Happy coding！**


[redux]: https://github.com/reactjs/redux#the-gist
[repo]: https://github.com/rxjs-space/rxjs-typescript-starter
[官方文档]: http://reactivex.io/rxjs/manual/overview.html
[scan运算符]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan
[RxJS官方教程 - State Stores]: http://reactivex.io/rxjs/manual/tutorial.html#state-stores
