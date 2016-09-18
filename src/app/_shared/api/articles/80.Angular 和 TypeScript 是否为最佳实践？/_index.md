# Angular 与 TypeScript 是否为最佳实践

本文内容来源于问题 https://www.zhihu.com/question/37182024 下的回答，略有修改。


## 写在前面

Angular 2 中，虽然可以自由选用 es5、es2015+、TypeScript 或者 Dart 来作为开发语言，但是官方最为推荐的方式是使用 TypeScript。
对于一些新接触 TypeScript 的童鞋们来说，往往会觉得 TypeScript 非常复杂难以理解。

但是事实真的是这样吗？

## 一个例子

这里我们来看一个非常简单的例子：

```typescript
import { NgModule, Component, Input, Attribute } from '@angular/core';
import { Greeter } from './services';

@Component({
  selector: 'hello',
  template: '<p>{{ message }}</p>',
})
export class Hello {
  constructor(greeter: Greeter) {
    this.message = greeter.say('hello', 'Angular 2');
  }
}
```

很遗憾的是，你们猜错了，我并木有打算对这个例子做任何讲解，我只是简单的说明一下，这个是没用 TypeScript 的版本。
（代码来源 https://github.com/shuhei/babel-angular2-app/blob/master/src/app.js，是一个纯 Babel 项目）

class 是 es2015 的语法，class decorator 是目前 es stage 2 的提案，都不是 TypeScript 的内容。（TypeScript 作为超集本身也支持了 JavaScript 的内容）

所以如果上面这样没有使用 TypeScript 的方式并木有让你觉得更容易的话，那么很简单，你所谓的困难和 TypeScript 没有什么关系。


## 困难的是？

TypeScript 在工程上来说并不算一门新的语言，而更接近于一个语言扩展。

并且仅仅是提供了类型标注和对应的静态检查，并没有任何功能上的扩展。

既然这些困难并非来源于 TypeScript，那么到底来源于何处呢？下面是一些可能的地方。


### 组件化

Web Components 已经是当前的实验性规范（集），并不是 Angular 或 Polymer 或任何库/框架的自有内容。
只是在规范完全定型之前，各个库/框架会有按照自己的解读来作为实现。

2.0 相对于 1.x 的一个重要区别是强制组件化。1.x 并非不能组件化，只是可以不组件化。
简单的说，在 1.x 的时候可以创建脱离 Directive 的 Controller，虽然概念上也必须归属于 Directive（ngController 也是一个 Directive，并没有不属于 Directive 的 Controller 实例），但是从工程实践上完全违背组件化。不过这样在简单程序中可能会非常方便，所以很多人在 1.x 的时候本来就不是按照最佳实践来做的，甚至很多人不知道 Angular 1.x 也可以组件化。

而实际上，在 Angular 1.x 中，Controller 本身也就只是一个初始化器而已，执行了一次之后就只是一个闭包容器。如果 1.x 按照最佳实践来（Controller As），就应当把实例无关的固有内容（也就是方法）放在原型上而非实例中。在 Angular 2 中，这个初始化函数仍然是存在的，如果是用 class 的话，就是类的构造函数，只是不再使用 Controller 这个误导性的关键字而已了。

如果有认真看过 Angular 1.x 的文档，就会知道即便在 Angular 1.x 中，用 Controller 来初始化内容也是错误的用法（[文档链接](https://docs.angularjs.org/api/ng/service/$compile#-bindtocontroller-)）：

> Deprecation warning: although bindings for non-ES6 class controllers are currently bound to this before the controller constructor is called, this use is now deprecated. Please place initialization code that relies upon bindings inside a $onInit method on the controller, instead.

此外，组件化也带来了 Life-Cycle Hooks 等内容，大大简化了复杂性。（相比于原先在 Angular 1.x 中需要额外提供一个配置对象而言）


### 函数响应式

实际上，就概念的提出而言，FP/FRP 可能要比 OO 还要早，只是在早期限于机器的运行效率，所以只能是人迁就机器而非机器迁就人。
因此，虽然 FRP 更为符合人类思维，但因为很多程序开发人员已经经过了长期的计算机思维的实践，反而对人类思维更加陌生。

Angular 2.0 的很多实现都基于 RxJS（并不是只有 Http 部分用到，Output 里使用的 EventEmitter 就是使用的 Subject），也就是 Reactive Extensions 的 JavaScript 实现。对于还在用 Callback 和 Promise 的童鞋来说，要直接跳到 RxJS 上确实可能需要一定的学习成本。

但是，这个学习成本并不在 Angular 上面，基于事件流的响应式编程（ReactiveCocoa 中貌似叫信号流）可以看成是一种编程范型，目前来说（在 UI 开发中）也是一种潮流和趋势。

RxJS 并不是 Angular 2 的，在任何前端框架或者没有框架的情况下都可以正常使用。对于熟悉 RxJS 的人来说，在 Angular 2 中可以感受到一种强烈的亲切感和由此带来的巨大的开发效率提升。
但对于只是把 RxJS（or RxWhatever）只是当成回调的另一种方式（即当成另一种 Promise）的人来说，除了语法更复杂之外并没有其他什么不同。所以如果不甚了解 Rx 的话，建议先行（或另行，也就是时间上并行）了解 Rx，重点在理念而不是用法，否则真的会被当成 Promise 来使用。


### 面向对象

对于长期把 JavaScript 当脚本语言来用的人来说，可能会很不习惯各种类、接口的先定义后使用，各种继承与实现等。

但其实面向对象仍然是使用非常广泛的一种范型（注意是范型不是泛型），在随着程序复杂度的增加还是有无可比拟的优势，特别对于 UI 程序来说是非常常用也非常实用的一种范型。另一方面，也希望不要把 JavaScript 只是看成一种脚本，对于组件化的 Web App 来说，JavaScript 和 Java、Objective-C/Swift 一样是一种程序开发语言。


### 注解/装饰器

这个并非 Angular 首创，在很多保留元数据（能够实现反射）的语言中（比如 Java／C#）都有大量使用。其本身并没有增加任何功能，大体效果上也就改变了一下 token 的位置（比如从 angular.directive(xxx) 变成 @Directive xxx）。但在风格上从命令式变为声明式，能够大大提供可读性和可维护性。
另外也完全可以用不带 Annotation/Decorator 的形式来进行 Angular 2 的开发。


### 模块化

实际上 Angular 2 的模块化才是标准的 ECMAScript 的模块化，只是因为 ES2015 来得太晚，大家都搞出来了很多自己的模块化方式而已。另外，由于 ES2015 的全面普及实现还需要时间，所以需要 Webpack 这样的 Bundler 或者 System.js 这样的 Polyfill。


### Transpile、Polyfill

在现在这个时间点下，即便不使用 TypeScript 而使用当前版本的 JavaScript（现在已经是 es7/es2016 了）一样会需要。

另外，TypeScript 并没有任何自己的 Polyfill（因为没有任何运行时 Feature 的存在），Core-js 只是单纯的 JavaScript 的 Polyfill。


## 综上

综上所述，Angular 2 本身几乎没有什么学习成本，TypeScript 也一样，总体的学习曲线基本取决于使用者在其他方面的基础水平。

当然，之所以前端开发再变得越来越 "复杂"（其实只是越来越接近非前端开发而已），归根到底还是应该考虑到，我们在做的东西本身也在越来越 "复杂"。
