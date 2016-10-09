# TS的介绍不管你是否掌握都值得一读(希望大家多提意见)

## 教程大纲

> 本教程不是TS的API也不会教你怎么搭建环境，我只是教你我个人认为最实用的精华部分整理出来。让大家去学习，同时也会介绍一些适用场景。
说实话随着软件业的发展，语言越来越相通，语法也就那么多，但你真的懂吗？我觉得搞编程的很大很大一部分人真的不是在编程，而是在模仿。
编写代码其实就像画国画，要有灵魂，他是一件艺术品。很多背后的东西是需要长时间的积累，国内的教材，个人觉得普遍都没有灵魂，当然也有
很多优秀的，但相对于国外的教材而言，真的国内的学习环境真的差很多。一门语言真的掌握起来真的很难，不是能做一个项目就是掌握，而是真
的把你的代码写的优雅，我就很不喜欢写注释，因为我觉得好的代码本身就是注释，程序员沟通就应该通过代码，但是可能这个也是我的坏毛病吧。

阅读之前 你应该了解下 JS的知识 ,对数据类型有了解 我没有单独的把数据类型拿出来介绍 而是融入了各个章节中

- TS的函数应用
- OOP
(以后持续更新)

声明：联系QQ 200569525 本教程绝对是原创的，如有意外雷同请联系我




## TS的函数应用

函数是一门语言不可缺少的部分，TS声明函数和js最大的区别就是设置了类型。

    var greetUnnamed = function(name : string) : string {
      if(name){
    return "Hi! " + name;
      }
    }

上述代码声明了一个函数，他的参数类型是字符串，返回值类型是字符串这个是大多数TS教程的声明办法

但是我在这里介绍一个完整的声明办法
    var hello : (name : string) => string = (name : string) : string =>{
      if(name){
    return "Hi! " + name;
      }
    }
这个可能有人觉得奇怪，为什么要这样声明。hello : (name : string) => string  这个其实是限定了hello这个变量值的所谓的类型,个人也不太建议这么写
当然了我会觉得代码量多了，但有时这么写是有必要的


如果TS只有这么一点功能，那也不叫JS的超集了，TS扩展了函数的功能，他加入了很实用的 可选参数，默认参数 及 不定参数等等。
    
    var add= (foo : number, bar : number, foobar : number) : number =>{
      return foo + bar + foobar;
    }
    
这个函数很简单是定义一个加法函数，将3个参数相加后返回，参数类型是 number 返回也是number
add(1,2,3) //得到6
但是问题出来了 
add(1,2)//这个时候就不匹配了

假设我们又要匹配

add(1,2,3)
和
add(1,2)

我们可以这么做

    var add =(foo : number, bar : number, foobar? : number) : number=> {
      var result =  foo + bar;
      if(foobar !== undefined){
    result += foobar;
      }
      return result;
    }

 foobar? : number 多了一个问号 这样这个参数就是可选的了（非常实用的功能）


默认参数
    
    var add = (foo : number, bar : number, foobar? : number) : number => {
      return foo + bar + (foobar !== undefined ? foobar : 0);
    }
喊多人可能认为这样就可以实现了,但是TS有更好更简洁的语法。
    
    var add = (foo : number, bar : number, foobar : number = 10) : number =>{
      return foo + bar + foobar;
    }

默认foobar没传的时候是 10 是不是很方便 没有了所谓的3元运算符

在写JS的时候 是不是经常会遇到一个情况 函数参数可能会很多个，我们都是通过 arguments 来判断的，TS给你一种更强大的方法

    
    var add = ( a: number, b : number,...foo : number[]) : number =>{
      var result = a+b;
      for(var i = 0; i < foo.length; i++){
       		 result += foo[i];
      }
     	 return result;
    }

上面这个函数可以匹配
add(1,2,3)
add(1,2,3,4)
add(1,2,3,4,5)
...

...foo:number[] ...为语法规则，foo为变量名 number[]为数组类型，这里以后的参数都是 number还可以 any[] 这样就是任意类型

熟悉JAVA的都知道 JAVA还有一个所谓的重载 大家应都玩过
    
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

这个大家应该都能看懂，无非是语法这样，重点介绍一下 value: (string | number | boolean) 变量value 他的可选类型 是字符串 数字 布尔 这个语法同样适用于
变量的定义，所以尽量不要用any

其他的一些算是 ES6的了 

例如 var let const 这些参考 ES6 

还有一些附加类容

例如js闭包，立即执行函数，其实在TS里面他就是所谓的类，当然关于OOP下章介绍


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
    
其实这个跟其他的OOP语言完全一样，他编译过后的JS就是所谓的立即执行函数，具体的就不细说了

下面讲一个非常实用的东西关于函数的，因为这个牵涉到你底层的代码的复用

    class User {
      name : string;
      age : number;
    }
    
    var userfn=(arr:User[]) :void =>{
    	console.log(arr);
    }

这里就是arr的类型不是简单类型，而是复杂类型这个时候我们就声明一个类 这个类定义了arr的类型

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
    
你会发现函数体是一样的，只是参数不一样。这个时候大多数人这样做

    
    var userfn=(arr:(User[]|User2[]) :void  =>{
    	console.log(arr);
    }

虽然这个满足了需求,但是假设类型是更多，我们就需要一个个加，放心TS的功能很强大下面我们用TS的标准方法解决这个需求。

    
    function userfn <T> (list : T[]) : void {
     console.log(list);
    }

这样子你就可以动态指定类型了

    userfn<User>([{name:"wike",age:27},{name:"test",age:28}])
    
    userfn<User2>([{city:"常州",age:27},{city:"南京",age:28}])

还有一些就是关于网页相关的了
大家都知道JS多行文字处理很差，早期需要拼接字符串，ES6新增了字符串模板
    var wike=`<h1>hello ${name}</h1>`;

关于HTML经常会出现一种问题就是 标签注入，导致网页变型，所以我们都需要将其转移，TS 让其语法更简洁

    var html = formathtml `<h1>${name} ${surname}</h1>`;

这样就转义了,当然了需要自己定义 formathtml 定义代码如下

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

这个比较底层了 如果看不懂 也没关系 网上应该有很多例子，思路我说下 
第一个参数就是模板字符串数组他会根据你的模板变量拆分split 大概这样 ["&lt;h1&gt;",' ','&lt;/h1&gt;']
然后第二个参数就是你模板里面的多个预定义变量这里也就是 ["${name}","${surname}"]
这个一说应该你很好理解了,如果你看过prototype的源码,他里面的模板其实原理差不多。

还有一个小补充的知识点 就是尽量用箭头函数，这个是ES6的语法，因为他修复了this的问题，具体的很多教程有就不细说了。

说的TS其实也就是JS 不可能不说异步。写JS应用不管怎么写，异步都不可避免。

早期通过面条时的回调函数来控制函数的嵌套执行顺序，这个代码看起来要死人的，后来不是有了q.js还有aynce.js等这些流程控制库

### 但ES6给了我们新的视野 Promises 其实Promises早就存在只是ES6把他拿过来用。
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

//这个是一种方法 也是普遍方法吧 我一直这样用， 具体的 Promise 的语法用法 资料太多不介绍了

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
    
这个我我个人感觉有点像生产者消费者 先生产 中断  消费者就绪 消费者消费 中断  唤醒生产者 
这个我也没怎么用过大家可以试试 因为这个非常好 性能高 占用内存很少  而且执行效率高  以后我也会使用
据说for循环用它相当节约内存

###最后一种大概说下 async and await 

说实话我没用过 好像是ES7的东西 个人不推荐 有兴趣的自己去了解





今天就暂时写到这里明天大概讲下OOP 这个我比较有心得


未完待续
