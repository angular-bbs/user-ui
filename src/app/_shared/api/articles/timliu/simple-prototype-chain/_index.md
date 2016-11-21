# 白话 JS 的原型链


## 写作原因/目的
> 本文记录笔者学习 JS 原型链的过程中的一些心得。了解原型链的教授们可以跳过本文，想看干货的同学们可以跳到第二部分。

对于在当前环境下的 Web 前端的初学者来说，一个很容易忽略的学习点是 JS 的原型链（别问我是怎么知道的）。  
为什么会这样？我觉得有这样两方面原因：

1. 技术进步了，我们在不了解 JS 底层（比如原型链，我的底线比较高）的情况下，就可以做出产品，不用自己造轮子。  
  而技术进步至少体现在：
  - 现在有 ES6，应用 extends 关键字扩展一个 class，实际上就是在应用原型链，即使我们不知道什么是原型链；
  - 现在有强大的框架，比如在 Angular 里，我们有现成的 directive、component 等等，不需要知道 component 是怎样继承了 directive。
2. 这个原型链的技术文档真的是太...太...底层了，大家来体会一下：
    > 根据 ECMAScript 标准，someObject.[[Prototype]] 符号是用于指派 someObject 的原型。  
    这个等同于 JavaScript 的 \_\_proto__  属性（现已弃用）。  
    It should not be confused with the func.prototype property of functions,   
    which instead specifies the [[Prototype]] of all instances of the given function.  
    从 ECMAScript 6 开始, [[Prototype]] 可以用Object.getPrototypeOf()和Object.setPrototypeOf()访问器来访问。  

    上面这段摘自MDN的文档《[继承与原型链][]》，英文版文档比中文的多了一句，插播在这里，没有翻译。  
    这段里，形似 proto 的东西有三个：
    - `someObject.[[Prototype]]内部属性`：这个是大写的 Prototype 被“双重方括号”括起来，我在console里敲一个，SyntaxError？！
    - `someObject.__proto__属性`：这个是 proto 的左右两边各有两个下划线，“现已弃用”？那学它干啥？！
    - `func.prototype属性`：这个是 func 的一个属性，“not to be confused with ...”？我很 confuse ，好吗！？！

    真是够底层的，还是交给 Angular 们吧，我要去做网站了。

就这样，初学者可能每天和原型链打着交道，却不想多看它一眼，至少我是这样的。  
不过呢，有这样一种场景，使得你不得不去了解原型链 -- 应聘时的笔试。  
当然，这只是开玩笑。了解原型链是学习 JS 不可或缺的一环，就像学习编程必须要明白什么事“面向对象”（我先去搜索引擎上看看）。  
本文尝试使用白话（尽量不使用术语）来解释原型链。  

## 干货区
- `[[Prototype]]内部属性`：
proto即“‘我没有找他’指针”
[[Prototype]]就是被proto指着的那个  
func.prototype是被func的实例的proto指着的那个

## “\_\_proto__”属性和“[[Prototype]]”内部属性

## func.prototype

## 案例 - 单线继承

## 一些operators


## 参考
- [继承与原型链][]
- [Inheritance and the prototype chain][]

[继承与原型链]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[Inheritance and the prototype chain]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain