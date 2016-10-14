# 注解与装饰器的点点滴滴

原文地址： https://zhuanlan.zhihu.com/p/22277764


对于很多 Java 开发人员来说，注解（Annotation）已经是一个十分熟悉的概念。而在 JavaScript 中（目前仍然是 Stage 2 的 ES Proposal），引入了一个类似的语法——装饰器（Decorator）。

甚至有很多人在日常工作中不区分这两个概念，把装饰器也叫做注解。那么，装饰器和注解到底有什么联系与区别呢？

## 概念

+ 注解（Annotation）：仅提供附加元数据支持，并不能实现任何操作。需要另外的 Scanner 根据元数据执行相应操作；
+ 装饰器（Decorator）：仅提供定义劫持，能够对类及其方法的定义并没有提供任何附加元数据的功能。

虽然语法上很相似，但在不同的语言中可能使用的是不同的概念：

+ 使用注解（Annotation）的语言：AtScript、Java、C#（叫 Attribute）；
+ 使用装饰器（Decorator）的语言：Python、JavaScript/ECMAScript。

从概念上来说，我们可以很清晰的看出，**注解和装饰器在语义上没有任何共性！**

但是，这个结论并不是那么符合我们的直觉，一个最直接的例子就是 Angular 2，在曾经结合 AtScript 使用的时候，用的是注解；在改成结合 TypeScript/ES next 使用的时候，用的是装饰器。虽然叫法变了，但在 API 方面几乎没有任何可见的变化，这又是为什么呢？


## 实现

这里以 AtScript 的注解和 ES Stage 2（截至目前）的 Decorator 为例。

在 AtScript 中，我们使用的是真真切切的 Annotation，也就是完完全全的单纯附加元数据，例如：

```atscript
// app.component.as（我也不记得 AtScript 后缀名是什么了）

@Component({
  selector: 'app'
})
class AppComponent {} 
```

等价于：

```javascript
// app.component.js

class AppComponent {} 

AppComponent.annotations = [
  new Component({
    selector: 'app'
  })
]
```

也就是简单地把注解中的类型转化成实例构造然后挂到被注解的类型上。

而在 ES next 的 Decorator 中，我们也可以使用类似的语法：

```typescript
// app.component.ts

@Component({
  selector: 'app'
})
class AppComponent {} 
```

但却具有完全不同的语义：

```javascript
// app.component.js

let AppComponent = Component({
  selector: 'app'
})(class AppComponent {})
```

*这里的对应结果并不完全精确，仅供表意。*

## 事实上

我们发现，对于注解有一个构造函数调用，对于装饰器而言有一个普通的函数调用。**既然有这个函数调用过程，我们其实可以在该函数调用中做任何事情！**

**或者说得更为直白一些，（AtScript 的）注解和（ES next 的）装饰器在实现上可以相互模拟！**

*对于装饰器而言，如果想要实现注解的功能，在原来的类型上挂点什么东西就好；对于注解而言，如果想要实现装饰器的功能，把现有类型（或其属性）按需替换掉就好。当然，后者可能会有一些限制，因为前提是要能够获取到目标类型，但 Annotation 本身并没有提供这个功能。*

现在我们可以知道，所有 Angular 2 中使用的 Decorator 都并不是真正作为 Decorator 使用，只是通过 Decorator + Reflect.metadata（泛指 Reflect.metadata 和 Reflect.xxxMetadata 等，下同） 的组合来模拟 Annotation 的功能。即附加元数据走的是 Reflect.metadata，该实现和 Decorator 本身并无联系。

**所以 Angular 2 中其实并没有通过 Decorator（这个语言特性）来实现附加数据，而是在 Decorator 的应用过程中，通过 Reflect.metadata 来附加数据，Decorator 在这里的意义仅仅是作为语法糖，把函数调用写的更好看了而已。**

另外，虽然我们的用法没有发生变化，但经过上面的讨论我们很容易知道在 Angular 2 中原先配合 AtScript 的 Component 实体的实现和现在配合 ES next 的 Component 实体的实现是完全不一样的，前者就是 ComponentMetadata，而后者是一个 ComponentDecoratorFactory。在 rc6 及之前 Component 这个 Factory 函数的配置对象的类型叫做 ComponentMetadata，rc7 及之后也同样叫 Component，但两者是不同的实体（前者是 const，后者是 interface），也就是说在 TypeScript 中如果 `import { Component } from '@angular/core'` 这样是同时引入了两个叫做 Component 的同名标识，本文不是 TypeScript 相关所以不做过多介绍。


## 总结

+ 注解和装饰器语法上很接近；
+ 注解和装饰器语义上没有一丁点关系；
+ Angular 2 曾经在 AtScript 中用的是注解语法；
+ Angular 2 现在在 ES next 中用的是装饰器语法；
+ 装饰器没有提供任何附加数据的功能；
+ 从 Core 模块中引入的 Component 是两个不同类型的同名标识符（TypeScript only）；
+ Angular 2 虽然用的装饰器的语法但并没有使用装饰器的功能；
+ Angular 2 的附加元数据是通过 Reflect.metadata 实现的，和装饰器本身并没有任何关系。
