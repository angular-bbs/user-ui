# 白话 JS 数值的可变与不可变 另 白话 Async 勘误

## 写作目的
如果你是 JS 的初学者，同时你又在学习前端框架（包括 Angular），你可能会对后面这个描述感到有些不解：“以不可变数值（immutable value）作为程序状态（app state）的载体，会提升程序的性能”。什么是可变与不可变（后文以 mutability 代替 “可变与不可变”）？为什么数值的 mutability 会影响程序的性能？本文将尝试尽量不使用术语来回答这些问题。

## 读者指引
需要读者接触过 Angular 的 @Input 和 ChangeDetectionStrategy。 

## 什么是数值的可变与不可变
  
首先要明确的一点是：当提到 mutability 的时候，我们是在说数值，而不是变量。比如 `var text = 'abc';`，这里变量是 text，而 text 所对应的数值 'abc'。mutability 是针对数值 'abc' 而言的。

===== 分隔线 =====

先说什么是不可变（immutable）。
在《JavaScript: The Definitive Guide, 4th Edition》，[关于 JS 的数据类型的章节][]有这么一句：
> ... because strings are immutable: there is no way to change the contents of a string value.

作者此时并不是在说明 mutability，但他不经意间说出了不可变数值的特点，即：我们无法改变一个不可变数值的内容。为什么不可变？原因有两种：一，人为设定某类数值不可变；二，逻辑不通（数字 1 变成了数字 2，它还是数字 1 吗？）。

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
很明显，我们成功的修改了 nameObj 的 firstName 属性。所以说，object 是可变的。可是，这（object 是可变的）又何坑之有呢？


## 为什么可变数值是个坑
“object 是可变的”，这一点并不是什么坑，坑的是“JS 中对可变数值的操作是以引用的方式（by reference）进行的”，内容变化了，引用却没变，一不留神，就变成了坑。以 object 类型数值为例（例3）：

```js
var valueObj = {a: 0};
var valueArr = [];
for(var i = 0; i < 2; i++) {
  var tempObj = valueObj;
  tempObj.a++;
  valueArr.push(tempObj);
}
var assert1 = valueArr[0] === valueObj;
var assert2 = valueArr[1] === valueObj;
var assert3 = valueArr[0] === valueArr[1];
var assert4 = valueObj.a === 2;
var assert5 = valueObj !== {a: 2};
var assertCombined = assert1 && assert2 && assert3;
console.log(assertCombined); // true
```
我们在 `var tempObj = valueObj;` 这里拷贝了 valueObj，为什么最后“valueObj、value[0]、value[1]三者是等价的”？我们并没有直接操作 valueObj.a，为什么 `valueObj.a === 2`？  

在 JS 里，对数值的操作有两种：拷贝与对比（向函数传递参数可以被当成拷贝）。对 object 类型的数值的操作是以引用的方式进行的，即内容只有一份，拷贝和对比的对象是引用，与内容无关。我们来细看一下上面的代码：
- `var valueObj = {a: 0};`，这行有3个动作，1) 新建一个变量 valueObj，2) 新建一个 object 实例 {a: 0}，3) 将“对 {a: 0} 的引用”**拷贝**到 valueObj；
- `var tempObj = valueObj;`，这行将 valueObj 上的“引用”**拷贝**到 tempObj；
- `tempObj.a++;`，这行改变了 tempObj.a 的值，此时，因为 valueObj 和 tempObj 有相同的引用，valueObj.a 也发生了变化；
- `valueArr[0] === valueObj;`，这行**对比** valueArr[0] 和 valueObj，对比的是二者的引用，他们都指向同一个 object，所以等价；
- `valueObj !== {a: 2};`，这行**对比** valueObj 与 {a: 2}（另一个 object 实例），尽管属性 a 数值相同，但两个引用不同，所以不等价。

知道了 object 数值的操作是以引用的方式进行，下面一个例子就不难理解了（例4）：

```js
var inputObj = {firstName: 'Doe', lastName: 'John'};
var inputObj_beforeChange = inputObj;
inputObj.firstName = 'Foo';
inputObj === inputObj_beforeChange; // true
```
这段代码先将 inputObj 复制到 inputObj\_beforeChange，然后改变 inputObj，之后对比改变后的 inputObj 与 inputObj_beforeChange，结果是仍然等价。这里的坑就是：我们无法通过“拷贝初值并与对比结果”的方式来判断可变数值的内容是否发生过变化。  
你可能会问：不能判断内容是否变化又怎么样？我们来看一下 Angular 2 里的 ChangeDetectionStrategy。假设我们有下面这个 component：

```ts
@Component({
  selector: 'item',
  templateUrl: '<p>{{ inputObj.firstName }}</p>',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() inputObj: {firstName: string, lastName: string};
  constructor() {}
}
```
如果我们不设置 changeDetection 属性，即使用 ChangeDetectionStrategy.default，那么 Angular 会在下列情况检查 ItemComponent，以决定是否重新渲染：
- 任何 DOM 事件发生的时候；
- 任何 timer 到期的时候；
- 任何 Ajax 返回的时候；

任何的意思是不论与这个 ItemComponent 有没有直接关系（即使是在其他 component 上发生了 dom 事件，也会来检查这个 ItemComponent）。为什么？因为任何上述事件都可能改变 inputObj 的内容。这样，因为 inputObj 的内容多数情况下不会改变，大多数对 ItemComponent 的检查是没有意义的。那么，我们试试 ChangeDetectionStrategy.onPush 吧，onPush 的意思是只有在 inputObj 发生变化的时候，才会检查 ItemComponent。我们在某个地方将 inputObj.firstName 改为 'Foo'，你会发现 ItemComponent 并没有更新。因为 inputObj 包含的是对一个 object 的引用，内容变化了，引用却没变，Angular 认为 inputObj 没有变化，所以不检查，也就没有重新渲染。那该怎么办？


## 如何绕过“object 是可变的”这个坑
上节介绍了“对可变数值的操作以引用方式进行”。那么，对不可变数值的操作又是怎样进行的呢？看例子（例5）：
```js
var numA = 1;
var numB = numA;
numA === numB; // true
```
number 类型的数值（以及其他不可变类型数据）的操作是以数值的方式进行的。`var numB = numA;`，这里是**拷贝** numA 的数值到 numB，即创建了一个新的数值 1，并分配给 numB；`numA === numB`，也是比较二者的数值。

仿照对不可变数值的操作，绕过“object 是可变的”这个坑的方法就是：在需要**拷贝** object 的时候，不是拷贝引用，而是手动创建新的 object，这样就有了一个新的引用，。例如（例6）：
```js
var inputObj = {firstName: 'Doe', lastName: 'John'};
var inputObj_beforeChange = Object.assign({}, inputObj); // 创建新的 object
inputObj.firstName = 'Foo';
inputObj === inputObj_beforeChange; // false
```







## 参考
- [关于 JS 的数据类型的章节][]
- [Language-specific details][]
- [By Value Versus by Reference][]

## 《白话Javascript的Event Loop和Async》勘误
《[白话Javascript的Event Loop和Async](https://wx.angular.cn/library/article/simple-javascript-event-loop-and-async)》里
> 另外，Promise和Observable可以是sync也可以是async，主要看Promise.resolve和observer.next是谁触发的。
Promise.then 是 async。
```js
var o$ = Rx.Observable.create((observer) => {observer.next('o$ is sending out something')}); // 同步触发 observer.next 
o$.subscribe(console.log);
console.log('after o$');

var p = new Promise((resolve, reject) => {
  resolve('p is sending out something');
});
p.then(console.log);
console.log('after p');
// 结果
// 'o$ is sending out something'
// 'after o$'
// 'after p'
// 'p is sending out something'
```



[关于 JS 的数据类型的章节]: http://docstore.mik.ua/orelly/webprog/jscript/ch04_04.htm
[Language-specific details]: https://en.wikipedia.org/wiki/Immutable_object#Language-specific_details
[By Value Versus by Reference]: http://docstore.mik.ua/orelly/webprog/jscript/ch11_02.htm#jscript4-CHP-11-SECT-2
