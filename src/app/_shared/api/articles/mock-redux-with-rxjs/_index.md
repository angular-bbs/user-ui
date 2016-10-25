初稿日期：2016年10月25日

## 写作原因/目的
大家可能听过或是正在用[Redux][]这个库。   
应用Redux，我们不再直接修改app state，而是把app state存放在一个store里面，通过store.dispatch(action)来发送action，而后触发一个reducer函数（reducer是一个pure function），这个reducer函数依据action来改变app state，再用store.subscribe()把app state推送出去。   

这里有个subscribe()哦。看看redux的package.json，里面有rxjs哦。   

那么如何用rxjs来直接实现state store的功能呢？   
rxjs的文档里就有答案，不过在reactivex.io/rxjs里面找不到，而是在github的repo里。  
[RxJS官方教程 - State Stores][]    
本文将尝试通过引入Subject来扩展文档示例中的state store的功能。    

这里先吐槽一下，[RxJS Doc在github上的源码][]里有这么一句：  
> These files are not meant for reading directly in GitHub, ... You should find the docs at http://reactivex.io/rxjs/, ...  

但是呢，有几个非常有用的.md文件，在reactivex.io/rxjs里是找不到的。  
其中一个.md里面就有这个state store。  
强烈建议大家翻阅一下[RxJS Doc在github上的源码][]。  


## 相关概念
以下为粗略理解，具体参见[官方文档][]。
1. Observer：一个Object，里面有3个callback，形如{next: nextFn, error: errorFn, complete: completeFn}，3个callback都不是必须的。  
2. Observable：定义某个时点通过调用observer.callback(v)来推送数据v，可以推无数个数据，通过subscribe()来启动执行，即使不给subscribe()传入任何参数。  
3. Subject：既是一个Observer（有next callback），又是一个Observable（将数据转推出去）。  
4. BehaviorSubject：是一个Subject，能留存最后一个数据；创建时需指定初始数据；可以通过getValue()获取留存的最后一个数据。（RxJS version 5文档中没提getValue()）    
5. [scan operator][]：如果把Observable推送的数据流类比成Array的话，scan operator就是Array.reduce。  

示例：
```js
const observer = {next: (v) => console.log(v)} // 一个Observer，只有next callback。
const observable$ = Observable.create((observer) => {
  observer.next(0); 
  setTimeout(()=>observer.next(1), 10)
  // ...
} // 创建一个Observable，在time 0的时候推送数据0, 并调用observer.next；在time 10的时候推送数据1，...。
observerable$.subscribe(observer) // 启动observable，并指定数据传给observer。

const subject$$ = new Subject() // 创建一个Subject
observable$.subscribe(subject$$) // 因为subject$$是一个observer
subject$$.subscribe(observer) // 因为subject$$也是一个observable

const subjectB$$ = new BehaviorSubject(9) // 创建一个BehaviorSubject, 需要一个初始值
subjectB$$.subscribe(observable) // 订阅一个BehaviorSubject，会把当前数据立即推送给observer
console.log(subjectB$$.getValue()) // getValue()获取留存的最后一个数据

observable$.scan((accumulated, current) => accumulated + current, 0)
// 类似Array的reduce，如[1, 2, 3].reduce((acc, curr) => acc + curr, 0)
```


## 编写代码  

变量命名规则：  
Observable以`$`结尾，如`state$`；  
Subject以`$$`结尾， 如`state$$`：  
Subscription以`_`结尾，如`ultimate_`。  

故事梗概：  
（action$$和state$$都是Subject，在外部推送数据给他们后，他们会转发出去。）   
外部推action给action$$，action被映射（即map）成changeFn，changeFn被递归（即scan）成state，state再被推给state$$，再转推给console.log。  
比如，外部推`INCREASE`给action$$，`INCREASE`被map成一个fn`(state)=>state+1`，这个fn被scan成一个新的state，如果上一个state是0的话，这个新的state就是1，这个state再被推给state$$，再转推给console.log。  

为什么不直接将action映射成state，而是将action映射成changeFn呢？  
如果要把action映射成state，每次映射操作都要通过`state$$.getValue()`来获取currentState，这就像在一个function里面使用一个global变量。   
而将action映射成changeFn，映射过程没有外部变量，更容易测试。   


代码：  

```js
/*
  定义interfaces, types；
  定义INCREASE, DECREASE两个常数，这样，后面可以用INCREASE变量来代替'INCREASE'字符串；
*/
type ActionType = 'INCREASE' | 'DECREASE'
interface Action {
  type: ActionType
}
const INCREASE: ActionType = 'INCREASE';
const DECREASE: ActionType = 'DECREASE';
type State = number;
type ChangeFn = (state: State) => State;

/*
 创建action$$，负责转发action。
 创建state$$，负责转发state，并留存最近的state，初始值为0。
 立即用console.log订阅到state$$，这样避免漏数据。
 在console.log订阅到state$$之后，state$$会立即将留存的state推给console.log，在console上看到0。
*/
const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject(0)
const ultimate_: Subscription = state$$.subscribe(console.log); // will log 0 immediately

/*
  changeFn$将action映射（map）成changeFn。
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
  state$将changFn递归（scan）成state，state初始为0。
*/
const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), 0)

/*
  用state$$订阅state$，state$开始向state$$推送数据
*/
const intermediate_: Subscription = state$.subscribe(state$$) 

/*
  用action$$.next()来向action$$推送action；
  这个action会经过map，scan变成一个state，然后被推给state$$，然后推给console.log
*/
action$$.next({type: INCREASE}) // 1
action$$.next({type: INCREASE}) // 2
action$$.next({type: DECREASE}) // 1

/*
  获取最近的state，用BehaviorSubject.getValue()
*/
console.log(state$$.getValue())    // current state is 1

// 在页面上创建两个按钮
const section = document.createElement('section')
document.body.appendChild(section);
const incButton = document.createElement('button');
incButton.innerText = INCREASE;
section.appendChild(incButton);
const decButton = document.createElement('button');
decButton.innerText = DECREASE;
section.appendChild(decButton);


/*
  创建click事件Observable，每次点按会推送一个action给action$$。
  立即调用subscribe()，以启动Observable，这里不必指定任何observer。
*/
Observable.fromEvent(incButton, 'click')
  .map(() => action$$.next({type: INCREASE})).subscribe()
Observable.fromEvent(decButton, 'click')
  .map(() => action$$.next({type: DECREASE})).subscribe()
```

## repo
以上源码可以在这个[repo][]里找到。

## 总结
这样，可以少一个dependency了。  
希望通过此文，可以帮助大家进一步了解RxJS，尤其是其中的Subject和scan operator。


## 参考
[Redux][]  
[RxJS官方教程 - State Stores][]  
[RxJS Doc在github上的源码][]  
[官方文档][]
[scan operator][]


Happy coding！

[RxJS官方教程 - State Stores]: https://github.com/ReactiveX/rxjs/blob/master/doc/tutorial/applications.md#state-stores
[Redux]: https://github.com/reactjs/redux#the-gist
[RxJS Doc在github上的源码]: https://github.com/ReactiveX/rxjs/tree/master/doc#rxjs-official-docs-at-httpreactivexiorxjs
[repo]: https://github.com/rxjs-space/rxjs-typescript-starter
[官方文档]: http://reactivex.io/rxjs/manual/overview.html
[scan operator]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan
