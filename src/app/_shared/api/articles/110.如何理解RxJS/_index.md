# 如何理解 RxJS ？

在 Angular 2 中，我们遇到了一个新的概念 —— RxJS。

对很多人而言，这可能是一个比较难以理解的地方。所谓的难以理解并不是说 API 有多复杂，而是对于 RxJS 本身的理念就无从下手。

所以，这里简单地对 RxJS 进行一些介绍。

## 函数响应式编程（FRP）

[FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) 早在上世纪 90 年代就已经被提出，但由于早期的编译器和运行时能力有限，大部分编程实践中往往采用的是人迁就机器的理念，即**命令式编程**，或者叫广义的面向过程。（这里指包括面向对象在内的以指定步骤的方式来编程的方式）

而另一类编程方式，叫做**声明式编程**。在声明式编程中，并不会为一个操作指定步骤，而只是单纯的给出我们的意图，而函数响应式编程就是声明式编程中的一个重要实践。

其实，声明式编程本身并不特别，例如我们的 HTML 就是一个很常见的声明式编程。

比如我们有下面的 HTML：

```html
<ul class="list">
  <li class="item">1</li>
  <li class="item">2</li>
</ul>
```

对应到命令式编程中，我们大概会得到下面的代码：

```javascript
const ul = document.createElement('ul')
ul.className = 'list'

const lis = [1, 2].map(n => {
  li = document.createElement('li')
  li.className = 'item'
  li.textContent = n.toString()
})

lis.forEach(li => ul.appendChild(li))
```

通过比较，我们可以很直观的发现在一些特定场景中声明式编程会比命令式编程要简洁很多。

除了 HTML 之外，XML、CSS、SQL 和 Prolog 等也都是声明式编程语言。而对于其它的通用编程语言而言，虽然语言本身大多属于命令式语言，但在特定场景下依然可以使用声明式编程的实践。


## Reactive Extensions

> 巨硬大法好！

Reactive Extensions 是微软（研究院）提出的一个函数响应式编程抽象，最早用于 .Net 中（位于 System.Reactive 命名空间下但不在标准库中），之后也被大量移植到其它语言，比如我们这里到 RxJS 就是 Rx 的 JavaScript 移植版本。

虽然语言不同，但 Rx 的核心思想以及主要 API 仍然是通用的，所以我们这里的内容同样适用于 RxWhatever。

为了解释函数响应式，我们先来简单看一看函数式编程。例如在 lodash 中，我们可以使用方法链的方式来实现复杂操作：

```typescript
interface Person {name: string, age: number}
declare const people: Person[]

_(people)
  .filter(person => person.age >= 18)
  .forEach(person => console.log(`${person.name} is an adult.`))
```

对于一般的函数式编程而言，我们会对数据的某种集合容器（Array、Map、Set 等等）进行组合与变换，而在 Rx 中，我们处理的是一类特殊的数据集合叫做 Observable，可以看作一个事件流。

现在，由于每一个数据项都是一个事件，我们并不能在一开始就获得所有的事件，并且事件具体在什么时候产生也无从得知。

一个很简单的例子，我们仍然需要处理上面的 person，但 person 不是同时获取的，而是通过用户交互动态创建的。当然，我们也可以把所有操作都写在回调函数里，但那样会造成极高的耦合度，破坏代码质量。

所以，我们可以把这里 person 的创建做成一个事件流，并不去关心在什么地方会用到，以及怎样用到。

```typescript
class SomeComponent {
  people: Subject<Person>
  
  onCreate(person: Person) {
    people.next(person)
  }
}
```

而对于真正的调用方，只要获取对应的 Observable，然后进行后续操作。

```typescript
const people$ = getPeopleObservableSomehow()

people$.filter(person => person.age >= 18)
  .subscribe(person => console.log(`${person.name} is an adult.`))
```

如果我们还有其它的数据源，比如初始数据从服务端获取，之后的数据才通过交互产生，我们可以进行一次组合：

```typescript
const initialPeople = getPeopleSomehow()
const people$ = getPeopleObservableSomehow()

const allPeople$ = Observable.from(initialPeople)
  .mergeMap(people$)

allPeople$.filter(person => person.age >= 18)
  .subscribe(person => console.log(`${person.name} is an adult.`))
```

这样，可以让我们的代码具有较高的复用性，同时又能极大地降低了耦合性，提高代码质量。

此外，函数响应式编程和对应的命令式编程对应的一大区别就是，函数响应式编程是 Push-based，而命令式编程（通常）是 Pull-based。也就是说，在函数响应式编程中我们并不会有取值这个操作（不会通过赋值来获取数据）。


### 与 Promise 的联系

我们已经知道，Promise 的一大特性就是组合与变换，那么 Promise 和 Observable 之间有什么联系呢？

事实上，我们确实也可以把 Observable 看成一个有可变数据量的 Promise，而 Promise 只能包含一个数据。

如果看成状态机的话，那么 Promise 具有 3 个状态：pending、resolved、rejected（如果 [Cancelable Promise](https://github.com/tc39/proposal-cancelable-promises) 正式通过，那么还会增加一个状态）。而 Observable 有 N + 3 个状态：idle、pending、resolved_0、resolved_1 ... resolved_N、completed 和 error。

因此，相比于 Promise 这个有限状态机而言，Observable 既可能是有限状态机，也可能是无限状态机（N 为无穷）。并且 Observable 还具有可订阅性，对于 Cold Observable 而言，只有订阅后才开始起作用，而 Promise 一经产生便开始起作用。

*Observable 可以分为 Cold Observable 和 Hot Observable，Cold Observable 只有被订阅后才开始产生事件，比如封装了 Http 的 Observable，而 Hot Observable 始终产生事件，比如封装了某元素 Click 事件的 Observable。*

此外，由于 Promise 仅有一个数据，故数据被获取即为 Promise 完成，仅需要一个状态。而对于 Observable，由于可以有任意多个数据，因此需要一个额外的状态来表示完成，一经完成后便不能再产生数据。

在当前的 RxJS 实现中，我们可以通过 .toPromise 运算符来将 Observable 转换为 Promise。

```typescript
const aPromise = anObservable.toPromise()
```


### 如何使用循环语法

我们知道，通过回调函数实现的迭代行为也能通过循环来实现（比如 for...of 和 Array#forEach），那么 Observable 也能使用循环的方式使用吗？

虽然大部分时候并不推荐，但是这也是完全可行的。比如我们这里可以简单地为 Observable 实现 Iterable：

```typescript
Observable[Symbol.iterator] = function () {
  let current = null
  let resolveCurrent = null
  let rejectCurrent = null
  let isDone = false
  
  function update() {
    current = new Promise((resolve, reject) => {
      resolveCurrent = resolve
      rejectCurrent = reject
    })
  }
  
  update()
  
  this.subscribe(item => {
    resolveCurrent(item)
    update()
  }, error => {
    rejectCurrent(error)
    update()
  }, () => {
    isDone = true
  })
  
  const next = () => ({ done: isDone, value: isDone ? null : current })
  
  return { next }
}
```

这样（仅供表意的实现版本，并没有经过严格验证，请勿直接用于实际项目中），我们就能够通过 for...of 循环的方式来使用：

```typescript
for (let itemPromise of someObservable) {
  let item = await itemPromise
  // do some thing with item
}
```

不过，这样我们仍然需要在循环体中使用 await，并不美观（其实已经比较美观了，只是为了引出下文这么说），为此我们可以更进一步，直接实现 Async Iterable（目前仍然是 Stage 3 的[提案](https://github.com/tc39/proposal-async-iteration)，有望进入 ES2017 中）：

```typescript
Observable[Symbol.asyncIterator] = function () {
  // 不详细写了，直接在 next 中返回 { done, value } 的 Promise 即可。
}
```

之后我们就能以更为简单的方式来循环了：

```typescript
for await (let item of someObservable) {
  // do some thing with item
}
```

## 运算符

对于 Promise 而言，由于有且只有一个数据，所以无需复杂的操作，仅需要一个简单的变换（返回值）或者组合（返回另一个 Promise）功能即可，甚至还可以把组合变换与使用统一为一个操作，也就是我们的 .then。

而对于 Observable，由于可以有任意多个数据，为了使用上的方便，提供了很多运算符，用来简化用户代码（可以参考 Array）。

同理，我们也无法简单地使用一个方法来实现全部操作：

+ 对于变换，（最简单的方式）需要使用 .map 方法，用来把 Observable 中的某个元素转换成另一种形式；
+ 对于组合，（最简单的方式）需要使用 .mergeMap 方法，用来把两个 Observable 整合为一个 Observable；
+ 对于使用，我们需要使用 .subscribe 方法，用来通知 Observer 我们需要它开始工作。

其它的运算符也不外乎是 **变换** 或者 **组合** 的某种特定操作，在理解了 Observable 的基本原理下，仔细阅读文档和对应的点线图就能很快了解某个运算符了。

当然还可能有另一类运算符，比如 .toPromise 等，这些并不返回 Observable 的方法其实本身并不是一个运算符，仅仅是对 Observable 的原型扩展。


## Angular 2 中的 Rx

在 Angular 2 中，其实必然会用到 Observable，因为在 @Output 对应的 EventEmitter 实际上就是一个 Subject（同时为 Observable 和 Observer），不过虽然 Angular 2 使用了，这并没有和我们的代码产生联系，所以如果不想使用 Rx，也可以完全无视它。

另一个使用了 Rx 的地方是 Http 模块，其中 Observable 作为大部分 API 的交互对象使用。当然，Http 本身就不是必须的，仅仅是一个官方的外部扩展，相比于其它第三方的库而言也没有任何实现上的特殊性（当然可能 API 设计上更为统一）。所以如果仍然不想使用 Observable，可以使用 .toPromise 的方式转换为 Promise 来使用，或者使用第三方的 Http Client 比如 SuperAgent 等，还可以直接使用 Fetch API。由于 Zone.js 的存在，并不需要对 Angular 进行对应封装。

其实在 Router 模块中也使用了 Rx，比如 [ActivatedRoute](https://angular.io/docs/ts/latest/api/router/index/ActivatedRoute-interface.html) 中的一些 API 都是以 Observable 的方式交互，用来实现动态响应。当然，我们也可以只使用 [ActivatedRouteSnapshot](https://angular.io/docs/ts/latest/api/router/index/ActivatedRouteSnapshot-interface.html)，这样就可以直接处理数据本身。同样，Router 模块也同样没有任何实现特殊性，如果我们愿意，我们也可以使用 [UI-Router](https://ui-router.github.io/ng2/) 的 Angular 2 版本。

不过从上面也可以看出 Angular 官方在很大程度上是推荐使用 Rx 的，并且在 API 设计上大量应用了 Rx 来简化复杂度，如果确实想要使用 Angular 2 进行团队项目开发，了解一些 Rx 的知识还是很有意义的。相比之下，要完全不使用 Rx 可能反而需要更高的学习成本。


## 总结

Rx 的知识在 Angular 2 中并不必须，主要用在 API 交互上，之所以推荐学习并不只是为了 Angular 2 的使用，函数响应式编程实践本身也很有价值。

理解了 Iterable 和 AsyncIterable 之后，也可能把 Observable 看成一个 AsyncIterable 的特例，也就是一个异步的迭代容器。

Rx 提供了大量的运算符，用于对 Observable 的组合与变换。
