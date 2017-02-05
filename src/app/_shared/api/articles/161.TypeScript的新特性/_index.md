# TypeScript的新特性

## 教程大纲

> 本教程不是TS的API也不会教你怎么搭建环境，我只是将我认为最实用的精华部分整理出来，让大家去学习，同时也会介绍一些适用场景。

阅读之前,你应该了解下JS的知识,特别是数据类型,我没有单独的把数据类型拿出来介绍,而是融入了各个章节中.

- TS的函数应用
- OOP

(以后持续更新)

## TS的函数应用

函数是一门语言不可缺少的部分，最大的作用在于，将弱类型的JS语法，在编写的过程中使用强类型的TS语法。

    var greetUnnamed = function(name : string) : string {
      if(name){
    return "Hi! " + name;
      }
    }

上述代码声明了一个函数，它的参数类型是字符串，返回值类型也是字符串，这个是大多数TS教程的声明方法。

如果TS只有这么一点功能，那也不叫JS的超集了，TS扩展了函数的功能，它加入了很实用的功能例如：

- 可选参数
- 默认参数
- 不定参数

### 可选参数

    var add= (foo : number, bar : number, foobar : number) : number =>{
      return foo + bar + foobar;
    }
    
这是一个很简单的加法函数，将3个参数相加后返回，参数类型是 number 返回的也是number。

`add(1,2,3) //得到6`

但是问题出来了，如果是下面这种情况 

`add(1,2)//这个时候就不匹配了`

假设我们又要匹配

`add(1,2,3)`和`add(1,2)`

我们可以这么做

    var add =(foo : number, bar : number, foobar? : number) : number=> {
      var result =  foo + bar;
      if(foobar !== undefined){
          result += foobar;
      }
         return result;
    }

 `foobar? : number ` 多了一个问号 这样这个参数就是可选的了（非常实用的功能）


### 默认参数
    
    var add = (foo : number, bar : number, foobar? : number) : number => {
      return foo + bar + (foobar !== undefined ? foobar : 0);
    }

很多人认为这样就可以实现了,但是TS有更好更简洁的语法。
    
    var add = (foo : number, bar : number, foobar : number = 10) : number =>{
      return foo + bar + foobar;
    }

默认`foobar` 没传值的时候是 `10`, 是不是很方便,再也不需要自己写三元运算符了。

### 不定参数

在写JS的时候,经常会遇到一个情况函数参数未知问题。我们都是通过 `arguments` 来判断的.TS给你一种更强大的方法:

    
    var add = ( a: number, b : number,...foo : number[]) : number =>{
      var result = a+b;
      for(var i = 0; i < foo.length; i++){
       		 result += foo[i];
      }
     	 return result;
    }

以上的这个函数就可以匹配下列各种情况

    add(1,2,3)
    add(1,2,3,4)
    add(1,2,3,4,5)
    ...

`...foo:number[]` **...** 为语法规则，`foo`为变量名 `number[]`为数组类型，这里的参数类型限定成number，如果类型是未确定,还可以使用 `any[]`， 这样就是任意类型。

## 一些其它特性

### 函数重载

熟悉JAVA的都知道 JAVA函数有重载机制，TS也实现了这个功能，语法如下
    
    function fn (name: string) : string;/这里是预定义函数的各种参数类型

    function fn (age: number) : string; /这里是预定义函数的各种参数类型

    function fn (single: boolean) : string; //这里是预定义函数的各种参数类型
    
    var fn =(value: (string | number | boolean) : string =>{ 
      switch(typeof value){
         case "string":
           return "输入的是字符串";
         case "number":
           return "输入的是数字"; 
         case "boolean":
           return "输入的是布尔值"; 
         default:
           console.log("非法参数");
      }
    }

这个时候`fn`它的参数，既可以是字符串，也可以是数字，也可以布尔值，不同的参数执行的逻辑代码不一样。当然这个是个简单的例子，在实际应用中可能会更复杂的代码逻辑。

这个涉及俩个部分，函数的预定义部分和函数主体的声明部分。

下面是函数的预定义部分，声明函数接受的各种参数，和返回值情况：

	    function fn (name: string) : string;/这里是预定义函数的各种参数类型
	
	    function fn (age: number) : string; /这里是预定义函数的各种参数类型
	
	    function fn (single: boolean) : string; //这里是预定义函数的各种参数类型

下面是函数的主体的声明部分，函数的所有逻辑都在这里声明：

	    var fn =(value: (string | number | boolean) : string =>{ 
	      switch(typeof value){
	         case "string":
	           return "输入的是字符串";
	         case "number":
	           return "输入的是数字"; 
	         case "boolean":
	           return "输入的是布尔值"; 
	         default:
	           console.log("非法参数");
	      }
	    }

重点介绍一下 `value: (string | number | boolean)` 变量 value这里声明的是多个可选类型，包括了（字符串、数字、布尔）。 这个语法同样适用于
变量的定义，所以尽量不要用any，而是限定你需要的多个类型。这样程序更加健壮。
例如:

		var str:string='1111';
		var num:number=22222;

		//以上是声明2个变量值类型分别是字符串和数字

		var strOrnum:(string|number)='1111';
		var strOrnum2:(string|number)=2222;

		//这样这个变量既可以是字符串也可以是是数字


### 变量作用域

`var` 关键字声明的变量，具有函数级作用域，函数的可访问性是根据函数来，子函数可以访问父函数的变量。**(这点是跟大多数编程语言不同，大多数编程语言是块作用域)**
`let` 这个关键字是声明块作用域的变量，一般配合 `if for {}`等代码块使用。

`const` 这个是申明常量，定义以后不允许修改。

###  立即执行函数（IIF），其实在TS里就是所谓的类

OOP，也就是面向对象编程，其目的是提高代码的可维护性，和代码的复用性。OOP与面向过程编程的最大区别就是代码的架构和抽象。面向过程基本是一个个函数组成，代码的复用通过函数来实现，维护性差组织性不好，所以出现了OOP。OOP一般是通过类来实现模板，通过继承来实现代码的复用，通过子类实现代码差异化，通过接口来规范代码的API，做到代码的无缝替换，还有抽象类帮助开发者让代码具体实现拖后，又不遗漏。还可以让其它开发者自己实现。还有另一大特性就是封装，数据的访问权限，方法的访问权限，这些最主要是防止多人开发集成的时候，无意或者恶意的代码，造成系统的破坏，当然还有更多特性。

IIF，其实就是一个函数，它声明后立即执行。为什么要这么做，其实它的最主要目的用于js的变量可访问性控制，用于减少全局变量。

解释：TS的类编译成js，它其实是立即执行函数，配合构造函数来实现的，当然所谓的私有属性也都能访问，但是TS编码阶段它会检测。


    class Person {
      private _name : string;
	      constructor() {
	        this._name = "wike";
	      }
	      get() : string {
	        return this._name;
	      }
	      set(val : string) : void {
	        this._name = val;
	      }
	      say() : void {
	        console.log("my name is"+this._name);
	      }
    }

编译后的代码（lhtin提供）：

    var Person = (function () {
	    function Person() {
	    this._name = "wike";
	    }
	    Person.prototype.get = function () {
	    return this._name;
	    };
	    Person.prototype.set = function (val) {
	    this._name = val;
	    };
	    Person.prototype.say = function () {
	    console.log("my name is" + this._name);
	    };
	    return Person;
    }());


### 函数的动态类

    class User {
      name : string;
      age : number;
    }
    
    var userfn=(arr:User[]) :void =>{
    	console.log(arr);
    }

假设我们需要声明一个变量，它的类型不再是简单类型，而是复杂类型。这个时候我们就声明一个类，类中的成员定义分别定义类型。 上面定义了一个自定义类型，这个类型是个对象它必须要有name和age属性，且name属性是字符串,age属性是数字。

    userfn([{name:"wike",age:27},{name:"test",age:28}]) //这个时候不会报错
    
    userfn([{name:"wike",age:27},{name:11111,age:28}]) //这个时候报错因为参数类型不匹配
    

现在假设我要实现同样的功能不同的类型

    class User2 {
      city : string;
      age : number;
    }
    
    var userfn2=(arr:User2[]) :void =>{
    	console.log(arr);
    }
    
你会发现函数体是一样的，只是参数类型不一样。一种方法是：

    
    var userfn=(arr:(User[]|User2[]) :void  =>{
    	console.log(arr);
    }

虽然这个方法满足了需求,假设类型很多，我们就需要一个个加，这样会很麻烦。功能很强大的TS还有一种方法：
    
    function userfn <T> (list : T[]) : void {
     console.log(list);
    }

这样子你就可以动态指定类型了

    userfn<User>([{name:"wike",age:27},{name:"test",age:28}])
    
    userfn<User2>([{city:"常州",age:27},{city:"南京",age:28}])

### 关于字符串的一些函数操作

大家都知道JS多行文字处理很差，早期需要拼接字符串，ES6新增了字符串模板，这个是ES6的

    var wike=`<h1>hello ${name}</h1>`;

但TS可以过滤模板，生成新的模板。

网页中经常遇到的一个问题就是字符串转义，TS让其语法更简洁。

    var html = formathtml `<h1>${name} ${surname}</h1>`;

这样就转义了,当然了需要自己定义 `formathtml` 定义代码如下

    function formathtml(literals, ...placeholders) {
	    let result = "";
	    for (let i = 0; i < placeholders.length; i++) {
	    result += literals[i];
	    result += placeholders[i]
	    .replace(/&/g, '&amp;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, ''')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;');
	    }
	    result += literals[literals.length - 1];
	    return result;
    }

这个比较复杂了，如果看不懂也没关系。网上应该有很多例子，思路我大概说下。

第一个参数：

模板字符串数组，它是根据你的字符串模板变量，根据里面的预定义变量来分割，这个例子得到的就是 `["<h1>",' ','</h1>']`。

第二个参数：

模板里面的多个预定义变量数组，这里也就是 `["${name}","${surname}"]`。

如果你看过prototype的源码,和它里面的模板的原理差不多。

### 关于this

尽量用箭头函数，这个是ES6的语法，因为它修复了this的问题。

这个应该算是JS的设计缺陷，因为每次新声明一个函数，大部分的`this`指向的是`window`(浏览器端)不管你这个函数是否是子函数，有一个例子除

外，那就是`new` 调用,这时创建一个自己的对象并返回。最典型的问题就是`settimeout`和`dom事件`。当然用`call`,`apply`可以改变this，

不过箭头函数正确的绑定了this。给个例子：
    
    	class Person {
	    	name : string;
	    	constructor(name : string) {
	    		this.name = name;
	    	 }
	    	 greet() {
	    		alert(`Hi! My name is ${this.name}`);
	    	 }
	    	  greetDelay(time : number) {
	    		setTimeout(function() {
	    		  alert(`Hi! My name is ${this.name}`);
	    		}, time);
	    	  }
    	}

    	var remo = new Person("remo");
    	remo.greet(); // "Hi! My name is remo"
    	remo.greetDelay(1000); // "Hi! My name is "//这里就出现BUG了

我的做法：
    
    	class Person {
	    	name : string;
	    	  constructor(name : string) {
	    	this.name = name;
	    	  }
	    	  greet() {
	    	   alert(`Hi! My name is ${this.name}`);
	    	  }
	    	  greetDelay(time : number) {
	    	   setTimeout(() => {
	    	 alert(`Hi! My name is ${this.name}`);
	    	   }, time);
	    	  }
    	}
    	
    	var remo = new Person("remo");
    
    	remo.greet(); // "Hi! My name is remo"
    
    	remo.greetDelay(1000); // "Hi! My name is remo"

编译后的JS代码：

	    Person.prototype.greetDelay = function (time) {
    	  var _this = this; //这里其实就是一个缓存
    	  setTimeout(function () {、
    		//这里的this是window 
    	alert("Hi! My name is " + _this.name);
    	  }, time);
    	};
    

## 函数的顺序控制

早期通过面条时的回调函数来控制函数的嵌套执行顺序，但是可维护下非常差。为了解决这个问题出现了例如：q.js、async.js等流程控制库

### Promises
 
其实Promises早就存在只是ES6把它拿过来用。

    function foo() {
      return new Promise((fulfill, reject) => {
    try
    {
      //成功的执行
      fulfill(value);
    }
    catch(e){
      //失败的执行
      reject(reason);
     }
      });
    }

    foo().then(function(value){ console.log(value); })
     .catch(function(e){ console.log(e); });

这个是一种方法,我一直这样用，具体的Promise的语法用法资料太多，不介绍了。

### 另一种语法 Generators
    
    function *foo() {
	    yield 1;
	    yield 2;
	    yield 3;
	    yield 4;
	    return 5;
    }
    
    var bar = new foo();
    bar.next(); // Object {value: 1, done: false}
    bar.next(); // Object {value: 2, done: false}
    bar.next(); // Object {value: 3, done: false}
    bar.next(); // Object {value: 4, done: false}
    bar.next(); // Object {value: 5, done: true}
    bar.next(); // Object { done: true }
    
我的理解是：

有点像进程通信中的生产者消费者，首先生产者生产代码，成功了之后，生产者中断生产等待消费者消费。
消费者消费了生产者的代码，唤醒生产者继续生产。 

推荐的理由：性能高，占用内存很少，而且执行效率高。

尤其在循环中运用，是相当节约内存。

### async和await 

这个在刚出来的时候研究过，不过那时候不是ts编译，复杂的异步情况下编译后的代码性能不太好。不过毕竟新功能还有待观望。随着标准化的推进，是值得期待的技术

未完待续
