# Mock Redux with RxJS - Episode 2 - Todo App

初稿日期：2016年11月08日


## 写作原因/目的
在上集[Mock Redux with RxJS][]里，我们用RxJS模拟了Redux的最基本的功能，即实现了一个`state`为数字的`state store`。
现实生活中，`state`的内容要复杂的多，而且除了改变`state`，我们还要处理`side effects`，比如更新`dom`、发送`ajax`请求等等。  
- 本集想要说明的是：  
  **应用RxJS，在改变`state`的同时，我们可以很直接的处理`side effects`，不需要像Redux那样使用`Thunk Middleware`。**    
  落实在代码上就是：  
  ```js
  // 从上集的
  const handlerA = (action: Action): ChangeFn => {return changeFn} // changeFn会被用来更改state
  // 变成本集的
  const handlerA = (action: Action): changeFn => {updateDom(); triggerAjax(); return changeFn}

  // handler所在位置（对应上集）：
  action$$.map(action => {
    switch (action.type) {
      case A: return handlerA(action);
      ...
    }
  })
  ```
  仅此而已。  
接下来的部分都是上面代码的具体应用，大家赶时间的话，可以全部跳过。    

本集承接上集，以Redux的思维，借助RxJS，制作一个Todo App。  

## 变量名Style约定
（这是我个人的Style约定，并非任何Best Practice。）
* `Observable`变量以`$`结尾，如`state$`；  
* `Subject`变量以`$$`结尾， 如`state$$`；  
* `Subscription`变量以`_`结尾，如`ultimate_`。 

## 相关概念

0. `Observer、Observable、Subject、BehaviorSubject、Observable.prototype.scan运算符`，这几个上集已提过，不重复。
1. `Obserable`与`Subject`的资源消耗说明：
  `Observable`像是一个`Function`，每次运行`sampleObservable$.subscribe(observer)`，都相当于一次`sampleFunction.call()`，是一次独立的运行，单独消耗资源。  
  而`Subject`维护一个[`observers`列表][]，每次运行`sampleSubject$$.subscribe(observer)`，只是运行了`Array.prototype.push`，将`observer`添加到`observers`列表，消耗资源很少。  
  举例来说：
    ```js
    const click$ = Observable.fromEvent(document, 'click');

    // 在文件A里：
    click$.subscribe(event => { // do some thing
    }); // 这相当于运行了一次addEventListener

    // 在文件B里：
    click$.subscribe(event => { // do some other thing
    }); // 又运行了一次addEventListener
    
    // 我们还可以这样：
    const click$$ = new Subject();
    const click$.subscribe(click$$); // 这里相当于运行一次addEventListener

    // 在文件A里：
    click$$.subscribe(event => { // do some thing
    }); // 这相当于向click$$的observers列表里添加了一个observer

    // 在文件B里：...

    ```  
    所以，本集代码里的`dom`事件，90%以上都被打包成了`Subject`，用来节省资源。参见代码中的`todo/dom-triggers/_shared.ts`。
2. [`Observable.ajax`运算符][]：将`XMLHttpRequest`打包成Observable，比如，POST一个新的Item到数据库：

    ```js
    const post$ = Observable.ajax.post(urlAll, form);
    // 或者
    const post$ = Observable.ajax({
      url: urlAll,
      body: form,
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // 不用手动设置这个header
      method: 'POST'
    })
    // 然后，用subscribe启动这个XMLHttpRequest
    post$.subscribe(res => console.log(res), err => console.log(err));
    ```
    

## 编写代码

源码：代码在这个[Repo][]里。  
运行：`npm install`，然后`npm run with-json-server`。  

= = = = = 分割线 = = = = =  

主演：

0. `action$$`、`state$$`，这两位上集介绍过了，是两个`Subject`，分别负责转推`action`与`state`。
1. `handlers`，这位上集有出场，但是没报姓名，就在`changeFn$`的`map`里：    
    ```js
    const changeFn$: Observable<ChangeFn> = action$$
      .map((action: Action) => {
        switch (action.type) {
          case INCREASE:
            return (state: State) => state + 1;
          // ...
        }
      })
    ```
    上面这个可以写成：`const changeFn$ = action$$.map(handlers)`。  
    上集中，`handlers`只根据`action`来返回一个`changeFn`。  
    本集中，`handlers`还要负责在更改`dom`（比如显示提示、使按钮失效等，不包括在dom上更新todo list）以及触发`ajax observable`。  

2. `triggers$`，这位在上集叫做“外部”，就是触发`action$$.next(action)`的主体，可以是domEvent、ajax，但要打包成Observable，比如：
    ```js
    const clickTrigger$ = Observable.fromEvent(document, 'click')
      .map(event => action$$.next({type: 'click', payload: event.XYZ}))
    // 每次点按，发送action
    // clickTrigger$不会自动运行，需要subscribe来启动
    ```
3. `renderer`，还是老演员，上集没报姓名：在`const ultimate_ = state$$.subscribe(console.log)`中，  
  这个`console.log`就是上集的`renderer`。本集的`renderer`负责在`state`更新时，更新`dom`里的列表部分。
4. 后端：[JSON Server][]。

= = = = = 分割线 = = = = =  

故事梗概：

1. `triggers$`触发`action$$.next(action)`，这个`triggers$`可以是打包成`Observable`的定时器、DOM事件或ajax等等；  
2. `handlers`把`action` `map`成`changeFn`，同时，更改`dom`，可能会触发`ajax observable`；   
3. `changeFn`被`scan`成`state`；  
4. `state`再被推给`state$$`；  
5. `state$$`再将`state`转推给`renderer`;
6. `renderer`更新`dom`。   
7. 如果步骤2中触发了`ajax observable`，这个`ajax observable`就化身为`triggers$`，再从步骤1开始走一遍。


= = = = = 分割线 = = = = =   
以`app启动`为例，走一遍流程。  

页面载入后，app启动，运行`action$$.next({type: CONST.GET_ALL_START})`。  
找找这个action的handler，  
```js
const changeFn$ = action$$.map(handlers);
export const handlers = (action: Action): ChangeFn => {
  switch (action.type) {
    case CONST.GET_ALL_START: return GET_ALL_START_handler(action);
    // ...
  }
}
```
就是这个`GET_ALL_START_handler`：  
就是这个`GET_ALL_START_handler`：  
就是这个`GET_ALL_START_handler`：  
（本文开篇说的就是它）
```js
export const GET_ALL_START_handler = (action: Action): ChangeFn => {
  GET_ALL_START_handler_dom();
  GET_ALL_START_handler_ajax();
  return defaultChangeFnFac(action)
}
```
`GET_ALL_START_handler_dom`就是在dom上显示消息，通知用户：稍等一下，我读个数据。  
`GET_ALL_START_handler_ajax`就是去读数据，要读所有数据，所以没参数。  
`defaultChangeFnFac(action)`返回一个changeFn（跟handler\_dom、handler_ajax没有任何关系），而后changeFn被scan成state，传给state$$，传给renderer。  

回到`GET_ALL_START_handler_ajax`，具体是这样：  
```js
const GET_ALL_START_handler_ajax = () => {
  getAll$Fac().subscribe((response: any) => {
    const list: Item[] = response.response
    action$$.next({
      type: CONST.GET_ALL_COMPLETE,
      payload: {list}
    })
  }, (error) => {
    action$$.next({
      type: CONST.GET_ALL_FAIL,
      payload: {error}
    })
  })
}
```  
getAll$Fac()返回一个Observable.ajax，subscribe启动这个Observable。  
读取数据成功，触发action$$.next({type: complete})，失败就是action$$.next({type: fail})，再去找handler，转一圈。  

= = = = = 分割线 = = = = =  
来看一下`index.ts`，和上集区别不大：

```js
import { handlers, domTriggers$, renderer } from ...

const stateInit: State = ...

export const action$$: Subject<Action> = new Subject()
const state$$: BehaviorSubject<State> = new BehaviorSubject(stateInit);

const ultimate_: Subscription = state$$.subscribe(renderer); // will log stateInit immediately
// 对应步骤5

const changeFn$: Observable<ChangeFn> = action$$
  .map(handlers)  // handlers将action map成changeFn，同时更改dom，触发ajax observable
// 对应步骤2

const state$: Observable<State> = changeFn$
  .scan((state, changeFn) => changeFn(state), state$$.getValue()) // 初始值是state$$.getValue()，即stateInit
// 对应步骤3

const intermediate_: Subscription = state$.subscribe(state$$) // state$开始向state$$推送
// 对应步骤4

const domTriggers_ = domTriggers$.subscribe(); // 启动domTriggers$
// 对应步骤1

action$$.next({type: CONST.GET_ALL_START}) // 这个action会触发ajax.getAll，从数据库读取已有的todo list;
// 对应步骤1

inputElem.focus(); // 可以输入新的todo了
```

## 总结
这样，是不是真的可以不用装redux了？  

希望通过此文，能够帮助大家进一步了解RxJS。

## 参考：
[Mock Redux with RxJS][]
[Repo][]
[`Observable.ajax`运算符][]
[`observers`列表][]
[JSON Server][]

[Mock Redux with RxJS]: https://wx.angular.cn/library/article/%E5%BA%94%E7%94%A8RxJS%E6%A8%A1%E6%8B%9Fredux
[Repo]: https://github.com/rxjs-space/rxjs-typescript-starter
[`Observable.ajax`运算符]: https://github.com/ReactiveX/rxjs/blob/master/src/observable/dom/AjaxObservable.ts
[`observers`列表]: http://reactivex.io/rxjs/file/es6/Subject.js.html#lineNumber25
[JSON Server]: https://github.com/typicode/json-server
