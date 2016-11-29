# 白话 JS 的原型链

初稿日期：2016-11-22

> 了解原型链的教授们或者使用 ES6 的朋友们可以跳过本文，想看干货的同学们可以从第3节干货区开始。  

## 写作原因/目的

对于在当前环境下的 Web 前端的初学者来说，一个很容易忽略的学习点是 JS 的原型链（别问我是怎么知道的）。  
为什么会这样？我觉得有这样两方面原因：

1. 技术进步了，我们在不了解 JS 底层（比如原型链，我的底线比较高）的情况下，就可以做出产品，不用自己造轮子。而技术进步至少体现在：
    - 现在有 ES6，应用 extends 关键字扩展一个 class，实际上就是在应用原型链，即使我们不知道什么是原型链；
    - 现在有强大的框架，比如在 Angular 里，我们有现成的 Directive、Component 等等，不需要知道 Component 是怎样继承了 Directive。

2. 这个原型链的技术文档真的是太...太...底层了，大家来体会一下：
    > 根据 ECMAScript 标准，someObject.[[Prototype]] 符号是用于指派 someObject 的原型。这个等同于 JS 的 \_\_proto__  属性（现已弃用）。  
    It should not be confused with the func.prototype property of functions, which instead specifies the [[Prototype]] of all instances of the given function.  
    从 ECMAScript 6 开始, [[Prototype]] 可以用Object.getPrototypeOf()和Object.setPrototypeOf()访问器来访问。  

    上面这段摘自MDN的文档《[继承与原型链][]》（英文版文档比中文的多了一句，插播在这里，没有翻译）。这段里，形似 proto 的东西有三个（我统称它们为“proto 什么的”）：
    - someObject.[[Prototype]] 内部属性：大写的 Prototype 被“双重方括号”括起来，我在console里敲一个，SyntaxError？！
    - someObject.\_\_proto__ 属性：proto 的左右两边各有两个下划线（跟markdown没关系），“现已弃用”？那学它干啥？！
    - func.prototype 属性：func是啥？func.prototype又是啥？“not to be confused with ...”？我很 confuse ，好吗！？！

    真是够底层的，还是交给 Angular 们来对付这些“proto 什么的”吧，我要去做网站了。  

就这样，初学者可能每天都在使用原型链，却不想多看它一眼，至少我是这样的。不过呢，有这样一种场景，使得你不得不去了解原型链 -- 应聘时的笔试。当然，这只是开玩笑。了解原型链是学习 JS 不可或缺的一环，有助于我们理解 JS 的工作原理。  

本文尝试使用白话（即尽量不使用术语）来解释原型链。  

## 读者指引
- 如果您在生活中可以自由的使用 ES6 中的 class，而不需要维护什么历史遗留的“< ES6”项目，其实可以不用看本文。  
- 阅读本文需要读者了解 JS 中的赋值运算符（'='）、相等运算符（'\=\=='）、不等运算符（'!=='），以及 this 关键字等等。
- 假设我们有 Foo 和 foo 两个对象，下面几个说法在本文中意思是一样的：
  - foo 继承 Foo
  - foo --> Foo
  - foo 的 [[Prototype]] 指向 Foo
  - foo.[[Prototype]] === Foo
  - foo.\_\_proto__ === Foo
  - Foo 是 foo 的原型

## 干货区
为什么需要继承？因为省（我）事（懒）、省（我）资（很）源（懒）。比如：我们有一个 “太阳” 代码（包含构成、尺寸等等），还要设计 “北京的太阳” 代码，我们可以让 “北京的太阳” 继承 “太阳”，就是说不必重新设计 “构成、尺寸等等”，只要加上一个 “若隐若现” 就可以了。  
而 JS 是以原型链的方式实现继承的。本文主要内容如下：（看不明白没关系，后面的段落会一一解释，希望我能解释明白。）
- someObject.[[Prototype]] 内部属性：我称它为“我没有找它指针”，这个指针是链式的，“我没有？找它；它也没有？找它的它...”。原型链由这个内部属性串起。
- someObject.\_\_proto__ 属性：这个是 [[Prototype]] 的访问器，可以认为 \_\_proto__ 和 [[Prototype]] 等效。（插播：MDN的中文文档《[继承与原型链][]》将“depreated”翻译成“已弃用”，这个说法有误导之嫌。\_\_proto__ 并非不能用了，而是推荐大家使用 Object.getPrototypeOf 和 Object.setPrototypeOf。关于这两个方法，后面会简单介绍。另外，提醒一下，如果大家参考 MDN 的中文文档的话，一定要对照英文文档，因为 1) 翻译跟进不及时，2) 翻译可能有误。）
- func.prototype 属性：func是个构造函数，func的实例的 [[Prototype]] 指向这个 func.prototype，即 func.prototype 是 func 的实例的原型。
- 原型链的尽头是null。
- 关于性能：原型链不要太长；没必要的情况下不要改变一个对象的 [[Prototype]]。

## [[Prototype]] 与 \_\_proto__
[[Prototype]] 是一个[内部属性][]（详情参看链接），我们不能直接读取或设置一个内部属性，需要读取或设置内部属性的时候就要看有没有相应的访问器了。  
而 \_\_proto__ 属性正是 [[Prototype]] 的访问器，它既是getter，又是setter，同时负责读取和设置 [[Prototype]]。如果我们能过直接访问 [[Prototype]]，那么会有以下代码：  
```js
someObject.[[Prototype]] === someObject.__proto__ // __proto__ 在这里是getter，读取 [[Prototype]]
// 下面两行赋值等效
someObject.[[Prototype]] = anotherObject;
someObject.__proto__ = anotherObject; // __proto__ 在这里是setter，设置 [[Prototype]]
```

我称 [[Prototype]] 为“我没有找它指针”，这个指针究竟有什么用呢？看栗子（F12打开浏览器console，贴入下面代码）（例1）：
```js
var lurenJia = {x: 0, y: 0}, ObjA = {x: 1, a: 1};
lurenJia.__proto__ = ObjA; // 将 lurenJia 的 [[Prototype]] 指向ObjA，此时，我们可以说 ObjA 就是 lurenJia 的原型
var assert0 = lurenJia.__proto__ === ObjA;
var assert1 = lurenJia.x !== ObjA.x; // lurenJia 有 x 属性，不用 ObjA 的 x
var assert2 = lurenJia.a === ObjA.a // lurenJia 没有 a 属性，“我没有找它指针”指向 ObjA，ObjA 上有，就用 ObjA.a

var ObjB = {y: 2, a: 2, b: 2};
ObjA.__proto__ = ObjB // 将 ObjA 的 [[Prototype]] 指向ObjB
var assert3 = ObjA.__proto__ === ObjB;
var assert4 = lurenJia.__proto__ !== ObjB;
var assert5 = lurenJia.__proto__.__proto__ === ObjB; // 看到链了吗？不是烤串哦。

var assert6 = lurenJia.y !== ObjB.y; // lurenJia 有 y 属性，不去 ObjA 或 ObjB 上找
var assert7 = lurenJia.a !== ObjB.a; // lurenJia 没有 a，ObjA 有，就用 ObjA.a，就不去 ObjB上找了
var assert8 = lurenJia.b === ObjB.b; // lurenJia 没有 b，“我没有找ObjA”，“ObjA 没有找 ObjB”，在 ObjB上找到了
// 原型链在行动

var assertCombined = assert0 && assert1 && assert2 && assert3 && assert4 && assert5 && assert6 && assert7 && assert8;
console.log(assertCombined); //true
```
someObject.[[Prototype]] 的作用就是：当我们在 someObject 上找不到某个属性的时候，就去其 [[Prototype]] 指向的对象上去找，如此往复。   
比如，要访问 lurenJia.b，先在 lurenJia 上找，没到到，去 lurenJia.[[Prototype]] 指向的对象即 ObjA 上找，ObjA上也没有，就去 ObjA.[[Prototype]] 指向的对象（ObjB）上找，直到原型链的尽头（剧透：尽头 === null）。  
这时，原型链是：`lurenJia --> ObjA --> ObjB --> ...（我们还不知道的东西） --> null （剧透了的东西）`。  
另外，如果 lurenJia.[[Prototype]] 指向 ObjA，我们就可以说 lurenJia 继承了 ObjA，或者，ObjA 是 lurenJia 的原型。

## func.prototype
在“例1”里，我们看到了原型链在行动，不过，好像还缺点什么。比如，我们需要一个 lurenYi，它和 lurenJia 很像，都是以 ObjA 为原型。
但是 lurenYi 有自己的 y 属性，不同于 lurenJia。我们要怎么做呢？看例子：  

行&nbsp;|例2                  |&nbsp;|例3                       
-----|--------------------------|---|--------------------------
1    |`var ObjA = {x: 1, a: 1};`||`var ObjA = {x: 1, a: 1};`
     |`// 略去若干行`
2    |`// 空`                    ||`var func = function(n) {this.y = n;}`  
3    |`// 空`                    ||`func.prototype = ObjA;`
4    |`var lurenYi = {};`       ||`var lurenYi = {};`
5    |`lurenYi.__proto__ = ObjA;`||`lurenYi.__proto__ = func.prototype;`
6    |`lurenYi.y = 9;`          ||`func.call(lurenYi, 9);`
&nbsp;  
“例2”表述直白，第4行先让 lurenYi 指向一个空的 object，然后设置 lurenYi 的 [[Prototype]] 指向 ObjA，然后向 lurenYi 添加属性 y。“例2”直白，但是如果我们需要 lurenBing、lurenDing ... ，是不是只能每次重复这3行？看后面。  
“例3”看上去有些麻烦，在第2行新建了一个构造函数（后面会说明什么是构造函数），然后（注意这里是重点），在这个构造函数上，人为的加上了一个 prototype 属性（func.prototype 与 func.[[Prototype]] 没有任何关系），然后让 func.prototype 指向 ObjA；   
而后，设置 lurenYi.[[Prototype]] 指向 func.prototype（最终指向 ObjA）；再调用 func，并以 lurenYi 为 this。
为什么要这样做？继续看例子：

行&nbsp;|例3（重复）                      |&nbsp;|例4
-----|------------------------------------- |---|--------------------------
1    |`var ObjA = {x: 1, a: 1};`            ||`var ObjA = {x: 1, a: 1};`
     |`// 略去若干行`
2    |`var func = function(n) {this.y = n;}`||`var func = function(n) {this.y = n;}`
3    |`func.prototype = ObjA;`              ||`func.prototype = ObjA;`
4    |`var lurenYi = {};`                   ||`var lurenYi = new func(9);`
5    |`lurenYi.__proto__ = func.prototype;` ||`// 空`
6    |`func.call(lurenYi, 9);`              ||`// 空`
&nbsp;  
“例4”的第4行，取代了“例3”的第4、第5、第6行，一个 new 运算符，搞定了下面三个步骤：  
1. 新建实例，指向空object。
2. 设置实例的 [[Prototype]] 指向“构造函数”的 prototype 属性（不是指向什么别的属性）。
3. 调用构造函数，以新建的实例为 this。  

new 运算符怎么这么牛？为什么new 可以设置实例的 [[Prototype]] 指向构造函数的 prototype 属性？
答：JS就是这么设计的，人为设定构造函数的 prototype 属性就是为了配合 new 运算符而存在的。后面如果我们需要 lurenBing，可以`var lurenBing = new func(10);`，新建实例变得简单多了。  

所以呢，func 是一个构造函数，func.prototype 是一个人为设定的属性，new 一个 func 的实例的时候，自动设置实例的 [[Prototype]] 指向 func.prototype。我们可以说，func.prototype 是 func 的实例的原型，反过来说就是：func 的实例继承了func.prototype。  
原型链就是：`lurenYi --> func.prototype`，assertion 就是：`lurenYi.__proto__ === func.prototype`。

===== 分隔线 =====  

前面提到了构造函数，什么是构造函数呢？构造函数就用来构造实例的函数，它的任务包括：
1. 初始化一个实例的自有属性（比如 lurenYi.y），所以要求构造函数有一个函数体，如：
    `var func = function(n) {this.y = n;}`。
2. 设置实例的 [[Prototype]] 指向构造函数的 prototype 属性，所以要求构造函数有 prototype 属性，如：
  `func.prototype = ObjA;`。  

其实，在生成一个构造函数的时候，JS会自动在其上配置 prototype 属性（当然，我们可以事后更改），这一点会在后面“原生构造函数”一节里说明。

## 多重构造函数下的原型链
（“多重构造函数”这个提法是笔者为开展下文而发明的，即原型链上有两个及以上构造函数的 prototype。大家往下看就知道了。）
假设我们有一个 Employee 构造函数，我们用 new 运算符生成一个实例 john，根据上一节，他们之间的原型链应该是`john --> Employee.prototype`。假设还有一个构造函数 Person，而且现在我们有两点需求：
1. 当请求 john.something 属性的时候，如果在 john 上和 Employee.prototype 上都找不到，还要去 Peroson.prototype 上找，即原型链是：  
  `john --> Employee.prototype --> Person.prototype`（我们可以说，这里用到了多重构造函数）； 
2. john 的初始化不仅受 Employee 影响，还受 Person 影响（暂且称这个过程为多重初始化）。  

这个该怎么设置？看例子（改编自MDN文档《[Object.prototype][]》中的一个示例）（例5）：

```js
var Person = function() {
  this.canTalk = true;
}; // 这个是上级构造函数
// JS自动给 Person 加上了 prototype 属性（会在后面“原生构造函数”一节里说明）

Person.prototype.greet = function() {
  if (this.canTalk) {
    console.log('Hi, I am ' + this.name);
  }
}; // 在上级构造函数的 prototype 属性上添加一个方法

var Employee = function(name, title) {
  Person.call(this); // 在后代构造函数中调用上一级构造函数
  this.name = name;
  this.title = title;
}; // 这是后代构造函数

Employee.prototype.__proto__ = Person.prototype;  // 这一行与《Object.prototype》原文不一样
// 设置后代构造函数的 prototype 的 [[Prototype]] 指向上一级的 prototype，即 Employee.prototype 继承 Person.prototype

var john = new Employee('John', 'CXO'); 
// new 相当于：var john = {}; john.__proto__ = Employee.prototype; Employee.call(john);
john.canTalk === true; // true. 这是调用了上级构造函数得到的
john.title === 'CXO'; // true. 这是调用了后代构造函数得到的
john.greet(); // Hi, I am John. 这是上级构造函数prototype上的方法
```

对应前面的两点需求：
1. 如何实现多重构造函数的原型链？赋值：`Employee.prototype.__proto__ = Person.prototype;`。
2. 如何实现多重初始化？在 Employee 构造函数里调用：`Person.call(this);`。

这样我们就有了原型链 `john --> Employee.prototype --> Person.prototype`。  
Person.prototype 由 JS 自动配置，它又是什么样的呢？我们继续。

## 原生构造函数
[JS的内建对象][]，有很多自身就是构造函数，比如Object, Function, Array, String, Number，Boolean，RegExp等等。怎么知道一个内建对象是不是构造函数呢？  
比如，Object，在console里敲入`new Object()`，没有报错，那么 Object 就是一个构造函数。  
比如，Math，在console里敲入`new Math()`，报错了，好吧，Math 就不是构造函数。  
那么多原生构造函数，具体都是做什么的？大家可以参看MDN的文档。这里简单提一下 Object 和 Function这两个构造函数。

===== 分隔线 =====  
Object 构造函数  

下面这2行得到的结果不完全相同，但也差不多：
```js
var bar = {}; // Object 字面标记（Object literal）
var bar = new Object(); // 新建 Object 实例
```
就是说，运行 Object 字面标记的时候，JS在幕后调用了 Object 构造函数。眼见为实（例6）：  
```js
var bar = {};
bar.__proto__ === Object.prototype; // true
```
即运行`var bar = {};`之后，即使没有手动调用 Object 构造函数，我们还是有了原型链`bar --> Object.prototype`。  

Object.prototype 又继承了谁呢？console 里敲一下：`Object.prototype.__proto__ // 得到 null`。  
即 Object.prototype 的原型是 null。完整的原型链：`bar --> Object.prototype --> null`。 

===== 分隔线 =====  
Function 构造函数

下面这3行得到的结果不完全相同，但也差不多：
```js
function Foo() {}; // 函数声明（function declaration）
var Foo = function() {}; // 函数表达式（function expression）
var Foo = new Function(); // 新建Function实例
```
即在运行函数声明和函数表达式的时候，JS 都在幕后调用了 Function 构造函数。眼见为实（例7）：
```js
function Foo() {};
Foo.__proto__ === Function.prototype; // true
```
前面提过，在生成构造函数的时候，JS 会自动给它配置一个 prototype 属性（Why？ JS 就是这么设计的）。Foo.prototype长什么样呢？ (例8)：
```js
function Foo() {};
Foo.prototype; // 回车，然后看到返回下面的一个 Object
// {
//  constructor: function Foo(),
//  __proto__: Object...
// }
```
回答上一节最后的问题（Person.prototype 什么样？这里是 Foo.prototype），Foo.prototype 在出生的时候，是一个 Object，有两个属性：
1. \_\_proto__：指向某个 Object，即 Foo.prototype 继承了某个 Object。
  这个 Obejct 又是什么？想一下，Foo.prototype 是JS自动设置的，会不会是通过 Object 构造函数设置的呢？验证：  
  `Foo.prototype.__proto__ === Object.prototype; // true`，果然是。所以，根据 Object 构造函数，我们在这里有一个原型链：  
  `Foo.prototype --> Object.prototype --> null`。
2. constructor： 指向 Foo。让我们完整的说一下：构造函数的 prototype 属性的 constructor 属性 指向 构造函数本身。这有什么用？  
  我们运行一下`new foo = Foo();`，如果我们想知道是哪个构造函数创建的 foo，我们可以用`foo.constructor`，但是在 foo 上是没有 constructor 属性的，就要到 Foo.prototype 上找，找到了 Foo.prototype.constructor，并且指向 Foo本身，JS 帮我们设置好了。除此以外，prototype.constructor 没啥用，除非真的想用。大家也不用纠结于为什么“我的一个属性指向我自己”，JS 就是这么设计的。

插播：`var Foo = () => {};`，运行这行（箭头函数）之后，Foo 不会成为一个构造函数，并且 JS 不会自动配置 Foo.prototype，`Foo.prototype === undefined`。  
敲敲看：`var Foo = function() {return {}}; var foo = new Foo();`，Foo 里返回对象的时候，foo.\_\_proto__ 是什么？foo.constructor又是什么？

===== 分隔线 =====  
原型链的尽头  

我来念一段经：
- JS里的对象都是实例，实例 继承 构造函数的 prototype，即 `foo.__proto__ === Foo.prototype;`，  
- 构造函数的 prototype 继承 Object.prototype，即 `Foo.prototype.__proto__ === Object.prototype;`，
- Object.prototype 继承 null，即 `Object.prototype.__proto__ === null;`, 
- null.[[Prototype]] 不存在，即 `null.__proto__; // Error`。

所以，原型链总会是 `foo --> Foo.prototype --> Object.prototype --> null`，即原型链的的尽头是 null。（Foo.prototype 可能不是直接继承 Object.prototype，而是继承另外一个对象，而另外一个对象继承另外一个另外的对象，但最终都会找到 Object.prototype 头上。）  
万物皆 null，null 即万物。善哉善哉。  

## 几个相关方法、运算符
（详情参考MDN文档）
- Object.getPrototypeOf(someObject)：取代 \_\_proto__ 的 getter 功能（\_\_proto__ is deprecated）。
- Object.setPrototypeOf(someObject)：取代 \_\_proto__ 的 setter 功能（\_\_proto__ is deprecated）。
- Object.create()：`var targeObject = Object.create(sourceObject)`，这行相当于： `targetObject = {__proto__: sourceObject}`。  
    “例5”的原型（《[Object.prototype][]》的示例）使用了 Object.create()，而且还有一行： `Employee.prototype.constructor = Employee;`。大家有时间可以考略一下为什么要设置（其实是重新设置） Employee.prototype.constructor？   
- SomeType.isPrototypeOf(someObject)：`Foo.prototype.isPrototypeOf(foo); // true`。
- someObject instanceof SomeType：`foo instanceof Foo; // true`。

## 性能考量
原型链不要太长，因为：
> The lookup time for properties that are high up on the prototype chain can have a negative impact on performance ... 

-摘自MDN之《[Inheritance and the prototype chain][]》

没必要的话，不要改变一个对象的原型，因为：
> Changing the [[Prototype]] of an object is ... a very slow operation ...  

-摘自MDN之《[Object.prototype.\_\_proto__][]》

## ES6 的 class
用ES6（或者TypeScript）的 class 重写“例5”，得到“例6”：

```ts
class Person {
  canTalk: boolean;
  name: string;
  constructor() {
    this.canTalk = true;
  }
  greet() {
    console.log('Hi, I am ' + this.name);
  }
}

class Employee extends Person {
  title: string;
  constructor(name, title) {
    super();
    this.name = name;
    this.title = title;
  }
}
```
'class'、'extends'、'super'，这些其实只是语法糖（后面还是会被编译成类似“例5”的样子），但是真的很甜很好吃，“proto 什么的”还是洗洗睡吧。  
此时，您可能会有些许不满：“看了这么一大长篇，最后你告诉我‘proto 什么的’没必要？！”  
这个没办法。我们赶上了这美好时代，有时候确实还是要去跟“proto 什么的”打交道。

## 总结
- 如果 A 是 B 的原型，那么原型链是 `B --> A`，assertion 是 `B.__proto__ === A`。  
- 如果 Foo 是构造函数，foo 是它的一个实例，那么原型链是 `foo --> Foo.prototype`，assertion 是 `foo.__proto__ === Foo.prototype`。

## 参考
- [继承与原型链][]
- [Inheritance and the prototype chain][]
- [内部属性][]
- [Object.prototype.\_\_proto__][]
- [Object.prototype][]
- [JS的内建对象][]

[继承与原型链]: https://developer.mozilla.org/zh-CN/docs/Web/javascript/Inheritance_and_the_prototype_chain
[Inheritance and the prototype chain]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[内部属性]: http://stackoverflow.com/questions/17174786/what-is-the-significance-of-the-double-brackets-for-the-prototype-property-i
[Object.prototype.\_\_proto__]: https://developer.mozilla.org/en-US/docs/Web/javascript/Reference/Global_Objects/Object/proto
[Object.prototype]: https://developer.mozilla.org/en-US/docs/Web/javascript/Reference/Global_Objects/Object/prototype
[JS的内建对象]: https://developer.mozilla.org/en-US/docs/Web/javascript/Reference/Global_Objects
