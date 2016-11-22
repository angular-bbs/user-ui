# 白话 JS 的原型链

> 本文记录笔者学习 JS 原型链的过程中的一些心得。了解原型链的教授们可以跳过本文，想看干货的同学们可以从[第二部分](#干货区)开始。  

## 写作原因/目的

对于在当前环境下的 Web 前端的初学者来说，一个很容易忽略的学习点是 JS 的原型链（别问我是怎么知道的）。  
为什么会这样？我觉得有这样两方面原因：

1. 技术进步了，我们在不了解 JS 底层（比如原型链，我的底线比较高）的情况下，就可以做出产品，不用自己造轮子。  
  而技术进步至少体现在：
  - 现在有 ES6，应用 extends 关键字扩展一个 class，实际上就是在应用原型链，即使我们不知道什么是原型链；
  - 现在有强大的框架，比如在 Angular 里，我们有现成的 directive、component 等等，不需要知道 component 是怎样继承了 directive。
2. 这个原型链的技术文档真的是太...太...底层了，大家来体会一下：
    > 根据 ECMAScript 标准，someObject.[[Prototype]] 符号是用于指派 someObject 的原型。  
    这个等同于 JavaScript 的 `__proto__`  属性（现已弃用）。  
    It should not be confused with the func.prototype property of functions,   
    which instead specifies the [[Prototype]] of all instances of the given function.  
    从 ECMAScript 6 开始, [[Prototype]] 可以用Object.getPrototypeOf()和Object.setPrototypeOf()访问器来访问。  

    上面这段摘自MDN的文档《[继承与原型链][]》，英文版文档比中文的多了一句，插播在这里，没有翻译。  
    这段里，形似 proto 的东西有三个：
    - `someObject.[[Prototype]]内部属性`：大写的 Prototype 被“双重方括号”括起来，我在console里敲一个，SyntaxError？！
    - `someObject.__proto__属性`：proto 的左右两边各有两个下划线（跟markdown没关系），“现已弃用”？那学它干啥？！
    - `func.prototype属性`：func是啥？func.prototype又是啥？“not to be confused with ...”？我很 confuse ，好吗！？！

    真是够底层的，还是交给 Angular 们来对付这些 proto 吧，我要去做网站了。  

就这样，初学者可能每天使用着原型链，却不想多看它一眼，至少我是这样的。  
不过呢，有这样一种场景，使得你不得不去了解原型链 -- 应聘时的笔试。  
当然，这只是开玩笑。了解原型链是学习 JS 不可或缺的一环，就像学习编程必须要明白什么是“面向对象”（我先去搜索引擎上看看）。  
本文尝试使用白话（即尽量不使用术语）来解释原型链。  

## 干货区
（看不明白没关系，后面的段落会一一解释，希望我能解释明白。）
- `[[Prototype]] 内部属性`：我称它为“我没有找它指针”，这个指针是链式的，“我没有？找它；它没有？找它的它...”。
- `__proto__ 属性`：这个是 [[Prototype]] 的访问器，既是getter，又是setter，即负责读取和设置 [[Prototype]]。
- `func.prototype`：这可不是 func 的 [[Prototype]]。func是个构造函数，func.prototype是一个人为指定的对象，func的实例的 [[Prototype]] 指向这个 func.prototype。
- 原型链的尽头是null。
- 原型链不要太长，没必要的情况下不要改变一个对象的 [[Prototype]]，因为：
  > The lookup time for properties that are high up on the prototype chain can have a negative impact on performance ... 

  -摘自MDN之《[Inheritance and the prototype chain][]》
  > Changing the [[Prototype]] of an object is ... a very slow operation ...  

  -摘自MDN之《[Object.prototype.\_\_proto__][]》


## [[Prototype]] 与 \_\_proto__
[[Prototype]] 是一个[内部属性][]（关于内部属性的定义，参看链接），我们不能直接读取或设置一个内部属性，那需要读取或设置的时候怎么办？用 `__proto__`。  
`__proto__` 是 [[Prototype]] 的访问器，既是getter，又是setter，即同时负责读取和设置 [[Prototype]]。  
如果我们能过直接访问 [[Prototype]]，那么会有以下代码：  
```js
someObject.[[Prototype]] === someObject.__proto__ // __proto__ 在这里是getter，读取 [[Prototype]]
// 下面两行等效
someObject.[[Prototype]] = anotherObject;
someObject.__proto__ = anotherObject; // __proto__ 在这里是setter，设置 [[Prototype]]
```

我称 [[Prototype]] 为“我没有找它指针”，这个指针究竟有什么用呢？  
看栗子（F12打开浏览器console，贴入下面代码）（例1）：
```js
var lurenJia = {x: 0, y: 0}, ObjA = {x: 1, a: 1};
lurenJia.__proto__ = ObjA; // 将 lurenJia 的 [[Prototype]] 指向ObjA，此时，我们可以说 ObjA 就是 lurenJia 的原型
var assert0 = lurenJia.__proto__ === ObjA;
var assert1 = lurenJia.x !== ObjA.x; // lurenJia 有 x 属性，不用 ObjA 的 x
var assert2 = lurenJia.a === ObjA.a // lurenJia 没有 a 属性，“我没有找它指针”指向 ObjA，ObjA 上有，就用 ObjA.a

var ObjB = {y: 2, a: 2, b: 2};
ObjA.__proto__ = ObjB // 将 ObjA 的 [[Prototype]] 设置为ObjB
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
someObject的 [[Prototype]] 指向someObject的原型，它的作用就是当我们在 someObject 上找不到某个属性的时候，就去其 [[Prototype]] 指向的对象上去找；  
比如，要访问 lurenjia.b，先在 lurenjia 上找，没到到，去 lurenjia 的 [[Prototype]] 指向的对象即 ObjA 上找，ObjA上也没有，就去 ObjA 的 [[Prototype]] 指向的对象（ObjB）上找，直到世界的尽头（参看后面的[原型链的尽头](#原型链的尽头)一节）。

## func.prototype 与 new 运算符
在“例1”里，我们看到了原型链在行动，不过，好像还缺点什么。比如，我们需要一个lurenYi，它和lurenJia很像，只是有自己的 y 属性。我们要怎么做呢？看例子：  

第n行|例2                       |例3                       
-----|--------------------------|--------------------------
1    |`var ObjA = {x: 1, a: 1};`|`var ObjA = {x: 1, a: 1};`
     |`// 略去若干行`
2    |空                        |`var func = function(n) {this.y = n;}`  
3    |空                        |`func.prototype = ObjA;`
4    |`var lurenYi = {};`       |`var lurenYi = {};`
5    |`lurenYi.__proto__ = ObjA;`|`lurenYi.__proto__ = func.prototype;`
6    |`lurenYi.y = 9;`          |`func.call(lurenYi, 9);`

“例2”表述直白，第4行让 lurenYi 指向一个空的 object，然后设置 lurenYi 的 [[Prototype]] 指向 ObjA，然后向 lurenYi 添加属性 y。  
“例3”看上去有些麻烦，在第2行新建了一个函数（这个就是“构造函数”，后面会详细说明），然后，注意这里是重点，然后在这个函数上，  
人为的加上了一个 prototype 属性（这个 prototype 属性与 [[Prototype]] 是没有任何关系的），然后让 func.prototype 指向 ObjA。   
而后，设置 lurenYi 的 [[Prototype]] 指向 func.prototype。再调用 func，以 lurenYi 为 this。为什么要这样做？继续看例子：

第n行|例3                                   |例4
-----|------------------------------------- |--------------------------
1    |`var ObjA = {x: 1, a: 1};`            |`var ObjA = {x: 1, a: 1};`
     |`// 略去若干行`
2    |`var func = function(n) {this.y = n;}`|`var func = function(n) {this.y = n;}`
3    |`func.prototype = ObjA;`              |`func.prototype = ObjA;`
4    |`var lurenYi = {};`                   |`var lurenYi = new func(9);`
5    |`lurenYi.__proto__ = func.prototype;` |空
6    |`func.call(lurenYi, 9);`              |空


我们可以这样（例2）：  
```js
var ObjA = {x: 1, a: 1};
// ... 略去若干行
var lurenYi = {}; // 新建一个空的object
lurenYi.__proto__ = ObjA; // 将 lurenYi 的 [[Prototype]] 设置为 ObjA
lurenYi.y = 9;
```
我们还可以这样（看上去好麻烦）（例3）：  
```js
var ObjA = {x: 1, a: 1};
// ... 略去若干行
var func = function(n) {this.y = n;} // 创建一个“构造函数” func，构造函数（constructor）是用来生成实例的函数
func.prototype = ObjA; // 人为的在 func 上添加一个 prototype 属性，并让 prototype 属性指向 ObjA
// 其实JavaScript在 func 生成时自动设置了 func 的 prototype 属性，我们这里做的是改变这个 prototype 属性

// 后面3行，例4里没有，被 new 运算符代替
var lurenYi = {};
lurenYi.__proto__ = func.prototype; // 将 lurenYi 的 [[Prototype]] 设置为 func.prototype，即 ObjA
func.call(lurenYi, 9); // 使用构造函数来设置 lurenYi.y

lurenYi.y === 9 // true
```
我们还可以这样（简单了一些，可是有啥用？）（例4）：
```js
var ObjA = {x: 1, a: 1};
// ... 略去若干行
var func = function(n) {this.y = n;} // 与“例3”相同
func.prototype = ObjA; // 与“例3”相同
var lurenYi = new func(9); // 很厉害的样子
lurenYi.y === 9 // true
```
一个 new 运算符，就搞定了“新建实例为空对象、设置实例 [[Prototype]] 指向构造函数的 prototype 属性、运行 `func.call(lunrenYi)`”三个步骤。  
new 运算符怎么这么牛？答：JavaScript就是这么设计的。注意第二步，根据“设计”，实例的 [[Prototype]] 指向的必须是 prototype 属性。      
显而易见，后面如果我们需要 lurenBing，可以`var lurenBing = new func(10);`，新建实例变得简单多了。  

所以呢，func.prototype 是一个人为设定的属性（JavaScript会自动设置这个属性，但也是根据事先设定好的剧本来设置的，而且我们可以事后更改），  
new 一个 func 的实例的时候，实例的 [[Prototype]] 指向 func.prototype。

## 使用构造函数的情况下的原型链
在使用构造函数的情况下，原型链是什么样的呢？ 一个构造函数又是如何继承另一个构造函数的呢（这个问题问的不妥，后面解释）？  

回顾“例1”，其中的原型链是这样：`lurenJia --> ObjA --> ObjB`，写成 assertion 就是：
```js
lurenJia.__proto__ === ObjA;
ObjA.__proto__ === ObjB;
```

经过上一节，我们已经有了 func 这个构造函数，假设我们还有一个 funcFoo 构造函数，它继承了func（这个说法不妥，后面解释），而foo是funcFoo的一个实例，原型链是什么样的呢？
`foo --> funcFoo --> func`，是这样的吗？No no no！  
应该是这样的：`foo --> funcFoo.prototype --> func.prototype`。写成 assertion 是：  
```js
foo.__proto__ === funcFoo.prototype; // 这是实例的 [[Prototype]] 指向其构造函数的 prototype 属性，这个在“例3”里看过了
funcFoo.prototype.__proto__ === func.prototype; // 后代构造函数的 prototype 属性的 [[Prototype]] 指向上一级构造函数的 prototype 属性
```
我们看到，说“构造函数继承另一个构造函数”是不妥的，应该是后代构造函数的 prototype 属性的 [[Prototype]] 继承了（指向）上级构造函数的 prototype 属性。  
为什么原型链是`foo --> funcFoo.prototype --> func.prototype`？答案还是：JavaScript就是这样设计的，这样可以配合 new，简化建立实例的过程。  

那么，怎么才能让`funcFoo.prototype.__proto__ === func.prototype;`的结果是 true 呢？  
赋值（value assignment）咯：`funcFoo.prototype.__proto__ = func.prototype`。这样原型链就有了。  

原型链保证了每个实例共享链上的属性、方法，但是新建实例的时候，每个实例不同于其他实例的属性怎么设置呢？还记得“例3”里的 `lurenYi.y` 是怎么来的么？  
调用构造函数咯，不过在后代构造函数里还要调用上一级构造函数，即`var funcFoo = function() {func.call(this); ...}`。  
让我们看例子吧（改编自MDN文档《[Object.prototype][]》中的一个示例）（例5）：

```js
var Person = function() {
  this.canTalk = true;
}; // 这个是上级构造函数

Person.prototype.greet = function() {
  if (this.canTalk) {
    console.log('Hi, I am ' + this.name);
  }
}; // 这是上级构造函数的prototype上的一个方法

var Employee = function(name, title) {
  Person.call(this); // 后代构造函数中调用上一级构造函数
  this.name = name;
  this.title = title;
}; // 这是后代构造函数

Employee.prototype.__proto__ = Person.prototype;  // 设置后代构造函数的 prototype 的 [[Prototype]] 指向上一级的 prototype
Employee.prototype.constructor = Employee; // 这个后面的func.prototype.constructor会解释

var john = new Employee('John', 'CXO'); // 新建一个实例，原型链是 john --> Employee.prototype --> Person.prototype
// new 相当于：var john = {}; john.__proto__ = Employee.prototype; Employee.call(john);
john.canTalk === true; // true. 这是调用了上级构造函数得到的
john.greet(); // Hi, I am John. 这是上级构造函数prototype上的方法
```

## 杂项
以上是本篇主要内容，下面提一些杂七杂八的东西：

### 性能考量
重复干货部分的内容：原型链不要太长；没必要的话不要改变一个对象的[[Prototype]]。  

### 几个相关方法、运算符
- `__proto__` 已被弃用，读取 [[Prototype]] 的时候用 `Object.getPrototypeOf(someObject)` ，设置 [[Prototype]] 的时候用 `Object.setPrototypeOf(someObject)`。  
因为在浏览器的console里，在所有的Object上还是可以看到 `__proto__`，本文暂且还是使用 `__proto__` 来读取或设置 [[Prototype]]。  
- 另外，在“例5中”，`Employee.prototype.__proto__ = Person.prototype;`，《[Object.prototype][]》中用的是`Employee.prototype = Object.create()`，这两个是等效的。
- SomeType.isPrototypeOf(someObject)
- someObject instanceof SomeType
- someObject.constructor
## 构造函数 return 一个 object 的时候

### 原生构造函数
Object, Function, Array, String, Number，Boolean，RegExp等等。


箭头function
### 原型链的尽头

### func.prototype.constructor
这个没啥用，除非真的想用。参看《[Why is it necessary to set the prototype constructor?][]》。  
这里说明一下“例5”的`Employee.prototype.constructor = Employee;`，为什么会有这么一行呢？  
如果没有这一行，Employee.prototype.constructor 就会继承 Person.prototype.constructor，这样很奇怪。  
那 `Person.prototype.constructor === Person` 是怎么来的呢？是 JavaScript 自动设置的。  
为什么？管他呢，我们现在有了 ES6 的 `class Employee extends Person {}`。  




## 总结
[[Prototype]] 是“我没有找它”指针，`__proto__` 是 [[Prototype]] 的访问器，func 的实例的 [[Prototype]] 指向 func.prototype。  


## 参考
- [继承与原型链][]
- [Inheritance and the prototype chain][]
- [内部属性][]
- [Object.prototype.\_\_proto__][]
- [Object.prototype][]
- [Why is it necessary to set the prototype constructor?][]

[继承与原型链]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[Inheritance and the prototype chain]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[内部属性]: http://stackoverflow.com/questions/17174786/what-is-the-significance-of-the-double-brackets-for-the-prototype-property-i
[Object.prototype.\_\_proto__]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
[Object.prototype]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
[Why is it necessary to set the prototype constructor?]: http://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor
