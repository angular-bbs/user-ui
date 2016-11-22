# 白话 JS 的原型链

初稿日期：2016-11-22

> 本文记录笔者学习 JS 原型链的过程中的一些心得。了解原型链的教授们可以跳过本文，想看干货的同学们可以从第3节干货区开始。  

## 写作原因/目的

对于在当前环境下的 Web 前端的初学者来说，一个很容易忽略的学习点是 JS 的原型链（别问我是怎么知道的）。  
为什么会这样？我觉得有这样两方面原因：

1. 技术进步了，我们在不了解 JS 底层（比如原型链，我的底线比较高）的情况下，就可以做出产品，不用自己造轮子。而技术进步至少体现在：
    - 现在有 ES6，应用 extends 关键字扩展一个 class，实际上就是在应用原型链，即使我们不知道什么是原型链；
    - 现在有强大的框架，比如在 Angular 里，我们有现成的 Directive、Component 等等，不需要知道 Component 是怎样继承了 Directive。
2. 这个原型链的技术文档真的是太...太...底层了，大家来体会一下：
    > 根据 ECMAScript 标准，someObject.[[Prototype]] 符号是用于指派 someObject 的原型。这个等同于 JavaScript 的 \_\_proto__  属性（现已弃用）。  
    It should not be confused with the func.prototype property of functions, which instead specifies the [[Prototype]] of all instances of the given function.  
    从 ECMAScript 6 开始, [[Prototype]] 可以用Object.getPrototypeOf()和Object.setPrototypeOf()访问器来访问。  

    上面这段摘自MDN的文档《[继承与原型链][]》，英文版文档比中文的多了一句，插播在这里，没有翻译。  
    这段里，形似 proto 的东西有三个：
    - someObject.[[Prototype]] 内部属性：大写的 Prototype 被“双重方括号”括起来，我在console里敲一个，SyntaxError？！
    - someObject.\_\_proto__ 属性：proto 的左右两边各有两个下划线（跟markdown没关系），“现已弃用”？那学它干啥？！
    - func.prototype 属性：func是啥？func.prototype又是啥？“not to be confused with ...”？我很 confuse ，好吗！？！

    真是够底层的，还是交给 Angular 们来对付这些 proto 吧，我要去做网站了。  

就这样，初学者可能每天都在使用原型链，却不想多看它一眼，至少我是这样的。不过呢，有这样一种场景，使得你不得不去了解原型链 -- 应聘时的笔试。当然，这只是开玩笑。了解原型链是学习 JS 不可或缺的一环，就像学习编程必须要明白什么是“面向对象”（我先去搜索引擎上看看）。即使我们不会自己来写library，了解原型链有助于我们理解其他library和框架的工作原理。  

本文尝试使用白话（即尽量不使用术语）来解释原型链。  

## 读者指引
假设我们有 Foo 和 foo 两个对象，下面几个说法在本文中意思是一样的：
- foo 继承 Foo
- foo --> Foo
- foo 的 [[Prototype]] 指向 Foo
- foo.[[Prototype]] === Foo
- foo.\_\_proto__ === Foo
- Foo 是 foo 的原型

## 干货区
（看不明白没关系，后面的段落会一一解释，希望我能解释明白。）
- someObject.[[Prototype]] 内部属性：我称它为“我没有找它指针”，这个指针是链式的，“我没有？找它；它也没有？找它的它...”。原型链由这个内部属性串起。
- someObject.\_\_proto__ 属性：这个是 [[Prototype]] 的访问器，可以认为 \_\_proto__ 和 [[Prototype]] 等效。
- func.prototype 属性：func是个构造函数，func的实例的 [[Prototype]] 指向这个 func.prototype，即 func.prototype 是 func 的实例的原型。
- 原型链的尽头是null。
- 关于性能：原型链不要太长，没必要的情况下不要改变一个对象的 [[Prototype]]。

## [[Prototype]] 内部属性 与 \_\_proto__ 属性
[[Prototype]] 是一个[内部属性][]（详情参看链接），我们不能直接读取或设置一个内部属性，需要读取或设置内部属性的时候就要看有没有相关的访问器了。  
\_\_proto__ 属性就是 [[Prototype]] 的访问器，它既是getter，又是setter，同时负责读取和设置 [[Prototype]]。如果我们能过直接访问 [[Prototype]]，那么会有以下代码：  
```js
someObject.[[Prototype]] === someObject.__proto__ // __proto__ 在这里是getter，读取 [[Prototype]]
// 下面两行等效
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
如果 lurenJia.[[Prototype]] 指向 ObjA，我们就可以说 lurenJia 继承了 ObjA，或者，ObjA 是 lurenJia 的原型。

## func.prototype 属性 与 new 运算符 与 构造函数
在“例1”里，我们看到了原型链在行动，不过，好像还缺点什么。比如，我们需要一个 lurenYi，它和 lurenJia 很像，都是以 ObjA 为原型。
但是 lurenYi 有自己的 y 属性，不同于 lurenJia。我们要怎么做呢？看例子：  

第n行&nbsp;|例2                  |&nbsp;|例3                       
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

第n行&nbsp;|例3（重复）                      |&nbsp;|例4
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
答：JavaScript就是这么设计的，构造函数的 prototype 属性就是为了配合 new 运算符而存在的。后面如果我们需要 lurenBing，可以`var lurenBing = new func(10);`，新建实例变得简单多了。  

所以呢，func.prototype 是一个人为设定的属性，new 一个 func 的实例的时候，自动设置实例的 [[Prototype]] 指向 func.prototype。我们可以说，func.prototype 是它的实例的原型，反过来说就是：实例继承了func.prototype。  
原型链就是：`lurenYi --> func.prototype`，assertion 就是：`lurenYi.__proto__ === func.prototype`。

===== 分隔线 =====  

前面提到了构造函数，什么是构造函数呢？构造函数就用来构造实例的函数，它的任务包括：
1. 初始化一个实例的自有属性（比如 lurenYi.y），所以要求构造函数有一个函数体，如：
    `var func = function(n) {this.y = n;}`。
2. 设置实例的 [[Prototype]] 指向构造函数的 prototype 属性，所以要求构造函数有 prototype 属性，如：
  `func.prototype = ObjA;`。  
另外，在生成一个构造函数的时候，JavaScript会自动给它分配一个 prototype 属性，这一点会在后面“[原生构造函数](#原生构造函数)”一节里说明。

## 使用构造函数的情况下的原型链
在使用构造函数的情况下，原型链是什么样的呢？一个构造函数又是如何继承另一个构造函数的呢（这个问题问的不妥，后面解释）？  

假设我们有一个 Employee 构造函数，我们用 new 运算符生成一个实例 john，根据上一节，他们之间的原型链应该是`john --> Employee.prototype`。假设还有一个构造函数 Person，而且现在我们有两点需求：
1. 当请求 john.something 属性的时候，如果在 john 上和 Employee.prototype 上都找不到，还要去 Peroson.prototype 上找，即原型链是：  
  `john --> Employee.prototype --> Person.prototype`；  
2. john 的初始化不仅受 Employee 影响，还受 Person 影响（暂且称这个过程为多重初始化）。  

这个该怎么设置？看例子（改编自MDN文档《[Object.prototype][]》中的一个示例）（例5）：

```js
var Person = function() {
  this.canTalk = true;
}; // 这个是上级构造函数
// JavaScript自动给 Person 加上了 prototype 属性（会在后面“原生构造函数”一节里说明）

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

Employee.prototype.__proto__ = Person.prototype;  // 这一行与《Object.prototype》不一样
// 设置后代构造函数的 prototype 的 [[Prototype]] 指向上一级的 prototype，即 Employee.prototype 继承 Person.prototype

var john = new Employee('John', 'CXO'); 
// new 相当于：var john = {}; john.__proto__ = Employee.prototype; Employee.call(john);
john.canTalk === true; // true. 这是调用了上级构造函数初始化实例得到的
john.title === 'CXO'; // true. 这是调用了后代构造函数初始化实例得到的
john.greet(); // Hi, I am John. 这是上级构造函数prototype上的方法
```

对应前面的两点需求：
1. 如何实现原型链？设置：`Employee.prototype.__proto__ = Person.prototype;`。
2. 如何实现多重初始化？在 Employee 构造函数里调用：`Person.call(this);`。

这样我们就有了原型链 `john --> Employee.prototype --> Person.prototype`。  
Person.prototype 长什么样呢？见下一节。

## 原生构造函数 与 原型链的尽头 与 func.prototype 出生时的样子
[JavaScript的内建对象][]，有很多自身就是构造函数，比如Object, Function, Array, String, Number，Boolean，RegExp等等。怎么知道一个内建对象是不是构造函数呢？  
比如，Object，在console里敲入`Object`，看到`function Object() { [native code] }`，那么，Object 就是一个构造函数。  
比如，Math，在console里敲入`Math`，看不到`function`字样，那么，Math 就不是一个构造函数。  
那么多原生构造函数，具体都是做什么的？大家可以参看MDN的文档。这里简单提一下 Object 和 Function这两个构造函数。

===== 分隔线 =====  
Object 构造函数  

下面这2行得到的结果不完全相同，但也差不多：
```js
var bar = {}; // Object 字面标记（Object literal）
var bar = new Object(); // 新建 Object 实例
```
就是说，运行 Object 字面标记的时候，JavaScript在幕后调用了 Object 构造函数。眼见为实（例6）：  
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
即在运行函数声明和函数表达式的时候，JavaScript 都在幕后调用了 Function 构造函数。眼见为实（例7）：
```js
function Foo() {};
Foo.__proto__ === Function.prototype; // true
```
前面提过，在生成构造函数的时候，JavaScript 会自动给它配置一个 prototype 属性。Foo.prototype长什么样呢？ (例8)：
```js
function Foo() {};
Foo.prototype; // 回车
// {
//  constructor: function Foo(),
//  __proto__: Object...
// }
```
Foo.prototype 在出生的时候，有两个属性：
1. \_\_proto__：指向某个 Object，即 Foo.prototype 继承了某个 Object。
  这个 Obejct 又是什么？想一下，Foo.prototype 是JavaScript自动设置的，会不会是通过 Object 构造函数设置的呢？验证：  
  `Foo.prototype.__proto__ === Object.prototype; // true`，果然是。所以，根据 Object 构造函数，我们在这里有一个原型链：  
  `Foo.prototype --> Object.prototype --> null`。
2. constructor： 指向 Foo。让我们完整的说一下：构造函数的 prototype 属性的 constructor 属性 指向 构造函数本身。这有什么用？  
  我们运行一下`new foo = Foo();`，如果我们想知道是哪个构造哈书创建的 foo，我们可以用`foo.constructor`，但是在 foo 上是没有 constructor 属性的，就要到 Foo.prototype 上找，找到了 Foo.prototype.constructor，指向 Foo，因为JavaScript 帮我们设置好了。除此以外，prototype.constructor 没啥用，除非真的想用。

插播：`var Foo = () => {};`，运行这行（箭头函数）之后，Foo 不会成为一个构造函数，并且 JavaScript 不会自动配置 Foo.prototype，`Foo.prototype === undefined`。  
敲敲看：`var Foo = function() {return {}}; var foo = new Foo();`，Foo 里返回对象的时候，foo.\_\_proto__ 是什么？foo.constructor又是什么？

===== 分隔线 =====  
原型链的尽头  

我来念一段经：
- JavaScript里的“东西”都是对象，对象继承构造函数的 prototype（`foo.__proto__ === Foo.prototype;`），  
- 构造函数的 prototype 继承 Object.prototype （`Foo.prototype.__proto__ === Object.prototype;` ），
- Object.prototype 继承 null （`Object.prototype.__proto__ === null;`）, 
- null.[[Prototype]] 不存在（`null.__proto__; // throw`）。

所以，原型链的尽头是 null。万物皆 null，null 即万物。善哉善哉。  

## 几个相关方法、运算符
（详情参考MDN文档）
- Object.getPrototypeOf(someObject)：取代 \_\_proto__ 的 getter 功能（\_\_proto__ 已被弃用）。
- Object.setPrototypeOf(someObject)：取代 \_\_proto__ 的 setter 功能（\_\_proto__ 已被弃用）。
- Object.create()：`var targeObject = Object.create(sourceObject)`，这行相当于： `targetObject = {__proto__: sourceObject}`。  
    “例5”的原型（《[Object.prototype][]》的示例）使用了 Object.create()，而且还有一行： `Employee.prototype.constructor = Employee;`。大家想想为什么要两行？   
- SomeType.isPrototypeOf(someObject)：`Foo.prototype.isPrototypeOf(foo); // true`。
- someObject instanceof SomeType：`foo instanceof Foo; // true`。

## 性能考量
引用两段话：
> The lookup time for properties that are high up on the prototype chain can have a negative impact on performance ... 

-摘自MDN之《[Inheritance and the prototype chain][]》
> Changing the [[Prototype]] of an object is ... a very slow operation ...  

-摘自MDN之《[Object.prototype.\_\_proto__][]》

## 总结
- 如果 A 是 B 的原型，那么原型链是 `B --> A`，assertion 是 `B.__proto__ === A`。  
- 如果 Foo 是构造函数，foo 是它的一个实例，那么原型链是 `foo --> Foo.prototype`，assertion 是 `foo.__proto__ === Foo.prototype`。

## 参考
- [继承与原型链][]
- [Inheritance and the prototype chain][]
- [内部属性][]
- [Object.prototype.\_\_proto__][]
- [Object.prototype][]
- [JavaScript的内建对象][]

[继承与原型链]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[Inheritance and the prototype chain]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[内部属性]: http://stackoverflow.com/questions/17174786/what-is-the-significance-of-the-double-brackets-for-the-prototype-property-i
[Object.prototype.\_\_proto__]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
[Object.prototype]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
[JavaScript的内建对象]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
