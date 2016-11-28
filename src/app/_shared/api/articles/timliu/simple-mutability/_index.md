# 白话 JS 数值的可变与不可变 另 白话 Async 勘误

## 写作目的
如果你是 JS 的初学者，同时你又在学习前端框架（包括 Angular），你可能会对后面这个描述感到有些不解：“以不可变数值（immutable value）作为程序状态（app state）的载体，会提升程序的性能”。什么是可变与不可变（后文以 mutability 代替 “可变与不可变”）？为什么数值的 mutability 会影响程序的性能？本文将尝试尽量不使用术语来回答这些问题。

## 读者指引
需要读者大概了解下列知识点：
- Object.assign 方法。
- Object 里的 getter 方法。
- Angular 2 的 @Input 和 ChangeDetectionStrategy。 

## 什么是数值的可变与不可变
  
首先要明确的一点是：当提到 mutability 的时候，我们是在说数值，而不是变量。比如 `var text = 'abc';`，这里变量是 text，而 text 所对应的数值是 'abc'。mutability 是针对数值 'abc' 而言的。

===== 分隔线 =====

先说什么是不可变（immutable）。
在《JavaScript: The Definitive Guide, 4th Edition》，[关于 JS 的数据类型的章节][]有这么一句：
> ... because strings are immutable: there is no way to change the contents of a string value.

作者此时并不是在说明 mutability，但他不经意间说出了不可变数值的特点，即：我们无法改变一个不可变数值的内容。为什么不可变？原因有两种：一，人为设定某类数值不可变；二，逻辑不通。

比如（例1）：

```js
var text = 'abc';
text[1] = 'd';
text[1] === 'b'; // true
```
我们可以认为 string 数值（比如“例1”中变量 text 所对应的数值）是由单一字符构成的，但是我们不能修改 string 中的某个单一字符，因为：这是人为设定，JS 就是这么设计的。在其他的编程语言中，存在 mutable string（参见[Language-specific details][]）。
除 string 以外，JS 中的 number, boolean 等其他“原始值（primitive types）”也是不可变的，原因是逻辑不通 -- 数字 1 在变成数字 2 以后就不再是数字 1 了。

===== 分隔线 =====

对照不可变数值，可变（mutable）数值就是：其内容可以改变的数值。在 JS 里，可变数值包含 object（array、function等等是特种 object）、map、set等等。以 object 为例（例2）：

```js
var nameObj = {firstName: 'Doe', lastName: 'John'};
nameObj.firstName = 'Foo';
nameObj.firstName === 'Foo'; // true
```
很明显，我们成功的修改了 nameObj 的 firstName 属性。所以说，object 是可变的。可是，这又何坑之有呢？


## 可变数值带来的是个什么坑
“object 是可变的”，这一点并不是什么坑，坑的是“JS 中对可变数值的操作是以引用的方式（by reference）进行的”，内容变化了，引用却没变，一不留神，就变成了坑。以 object 类型数值为例（例3）：

```js
var inputObj = {firstName: 'Doe', lastName: 'John'};
var inputObj_beforeChange = inputObj;
inputObj.firstName = 'Foo';
inputObj === inputObj_beforeChange; // true
```
- `var inputObj = {firstName: 'Doe', lastName: 'John'};`：这一行包含三个步骤，1）创建变量 inputObj，2）创建新的 object 实例，3）把“对 object 实例的引用”分配给 inputObj。
- `var inputObj_beforeChange = inputObj;`：这里是拷贝 inputObj 所包含的引用，并分配给 inputObj_beforeChange。
- `inputObj.firstName = 'Foo';`：改变 inputObj 引用的 object 的内容。
- `inputObj === inputObj_beforeChange;`：对比两个引用，因为引用相同，此处为 true。

这里的坑就是：我们无法通过“拷贝初值并与结果对比”的方式来判断可变数值的内容是否发生过变化。  

## 可变数值的坑的影响
你可能会问：不能通过哇啦哇啦的方式来判断哇啦哇啦又怎么样？我们来看一下 Angular 2 里的 ChangeDetectionStrategy。假设我们在 AppComponent 下有一个这样的 ItemComponent：

```ts
@Component({
  selector: 'item',
  templateUrl: '<p>{{ inputContent.firstName }}</p>',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() inputObj: {firstName: string, lastName: string};
  constructor() {}
  get inputContent() {
    console.log('detecting changes on template expression');
    return inputObj;
  }
}
```
如果我们不设置 changeDetection 属性，默认使用 ChangeDetectionStrategy.default，那么 Angular 会在下列情况对 ItemComponent 进行变更检查，以决定是否重新渲染：
- 任何注册了 listener 的 DOM 事件发生的时候；
- 任何 timer 事件发生的时候；
- 任何 Ajax 返回的时候；

任何的意思是不论事件与 ItemComponent 有没有直接关系（即使是在其他 component 上发生了 dom 事件，也会来检查这个 ItemComponent）。为什么？因为任何上述事件都可能改变 inputObj 的内容。但是，因为 inputObj 的内容在多数情况下不会改变，大多数对 ItemComponent 的检查是没有意义的。  
落实到我们的 ItemComponent 上，每次变更检查都会调用 get inputContent，我们可以在 AppComponent 上添加一个按钮，注册一个 click listener，但不做任何事情，比如：
```html
<!--in app-component.html-->
<button (click)="0">Click me</button>
<item [inputObj]="fakeObj"></item>
```
```ts
// in app-component.ts
fakeObj: any = {firstName: 'John', lastName: 'Doe'};
// in item-componet.ts
changeDetection: ChangeDetectionStrategy.default
```
每次点按按钮，ItemComponent 上的 get inputContent 都会被调用，即使这个按钮是在 ItemComponent 之外。  
那么，我们试试 ChangeDetectionStrategy.onPush 吧，onPush 的意思是只有在 inputObj 发生变化（或者 ItemComponent 自身有事件发生）的时候，才会检查 ItemComponent。我们可以这样：
```html
<!--in app-component.html-->
<button (click)="fakeObj.firstName='Foo'">Click me</button>
<item [inputObj]="fakeObj"></item>
```
```ts
// in item-componet.ts
changeDetection: ChangeDetectionStrategy.onPush
```

在点按 AppComponent 上的按钮时 inputObj.firstName 改为 'Foo'，你会发现 ItemComponent 并没有更新。因为 Angular 判断一个 @Input 数值是否变化的方式就是“拷贝初值并与结果对比”，这个方式对 object 是无效的。踩到坑了，怎么办？

## 如何绕过可变数值带来的坑
承接上节的 Angular 例子，我们可以在需要改变一个 object 的属性的时候，创建一个新的 object：
```html
<!--in app-component.html-->
<button (click)="changeObj()">Click me</button>
<item [inputObj]="fakeObj"></item>
```
```ts
// in app-componet.ts
changeObj() {
  this.fakeObj = Object.assign({}, this.fakeObj, {firstName: 'Foo'})
}
```


这样，就有了一个新的引用，Angular 就能通过“拷贝初值并与结果对比”来感知 inputObj 发生了变化。我们可以称这个过程为“强制不可变”，即不去改变一个可变数值，也不拷贝原来的引用，而是创建新数值，克隆原数值的内容，并在此基础上修改。但是 Object.assign 还是比较“肤浅”，如果一个 object 是多层级的，比如 {a: 1, b: {x: 2}}，这里 b 包含的也是一个引用，一个 Object.assign 不能搞定，我们有几种选择：
- 在 app 中只使用包含一个层级的 object（这个不太现实）。
- 使用循环多级克隆原数据的内容（可能会影响性能）。
- 借助第三方库，如 ImmutableJS（又有一堆新的 api，但为了 app performance，翻滚翻滚）。

在 Angular 中使用“强制不可变”配合 ChangeDetectionStrategy.onPush 并不能完全杜绝无效检查，比如 inputObject 的内容没有变化，却创建了新的 inputObject，引用变了，就会检查一次。不过，这还是比 ChangeStrategy.default 强得多，可以大幅减少不必要的变更检查。所以就有了开篇提到的：“以不可变数值（immutable value）作为程序状态（app state）的载体，会提升程序的性能”。  

题外话：使用 immutable value 并不是改善变更检查效率的唯一途径，还可以使用 observables。参见[Change Detection in Angular 2][]。

## 总结
JS 中对可变数值的操作是以引用的方式进行的，内容变化了，引用却没变。“旧瓶装新酒”不一定总是我们想要的。

## 参考/推荐阅读
- [关于 JS 的数据类型的章节][]
- [Language-specific details][]
- [By Value Versus by Reference][]
- [How does Angular 2 Change Detection Really Work ?][]
- [Change Detection in Angular 2][]

## 《白话Javascript的Event Loop和Async》勘误
《[白话Javascript的Event Loop和Async](https://wx.angular.cn/library/article/simple-javascript-event-loop-and-async)》里提到这样一句：
> Promise和Observable可以是sync也可以是async，主要看Promise.resolve和observer.next是谁触发的。

这里有重大错误。正确的说法应该是：  
Observable 在创建的时候，不会自动运行，需要使用 subscribe 方法启动。而 Observable 的运行，可以是 sync 也可以是 async，主要看 observer.callback 是谁触发的。比如：
```js
var o$ = Rx.Observable.create((observer) => {observer.next('o$ is sending out something')});
o$.subscribe(console.log); // subscribe 以后，同步触发 observer.next 
console.log('after o$.subscribe');
```
在 console 里看到：先有 'o$ is sending out something'，再有 'after o$.subscribe'。

Promise 在创建的时候，立即运行，运行的过程可以是 sync 也可以是 async，主要看 resolve 或 reject 是谁触发的。  
- （重点在这里）在Promise.prototype.then上注册的 callback 一定是被 async 执行的。比如：
```js
var p = new Promise((resolve, reject) => {
  console.log('begin');
  resolve('p is sending out something'); // 这个 resolve 是 sync 的
});
// 在 console 上立即看到 'begin'
p.then(console.log); // 这个 console.log 会被添加到 task queue，而不是直接进入到 call stack
console.log('after p.then');
```
在 console 里看到：先有 'after p.then'，再有 'p is sending out something'。

特此更正，并对读者致歉。

Happy coding!

[关于 JS 的数据类型的章节]: http://docstore.mik.ua/orelly/webprog/jscript/ch04_04.htm
[Language-specific details]: https://en.wikipedia.org/wiki/Immutable_object#Language-specific_details
[By Value Versus by Reference]: http://docstore.mik.ua/orelly/webprog/jscript/ch11_02.htm#jscript4-CHP-11-SECT-2
[How does Angular 2 Change Detection Really Work ?]: http://blog.angular-university.io/how-does-angular-2-change-detection-really-work/
[Change Detection in Angular 2]: https://vsavkin.com/change-detection-in-angular-2-4f216b855d4c#.tdkm5385e
