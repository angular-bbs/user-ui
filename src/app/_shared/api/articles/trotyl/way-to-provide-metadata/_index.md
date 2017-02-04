# Metadata 的提供途径

声明式编程一直是 Angular 所推崇的方式之一，在 Angular 中，大多数时候我们不再使用各种复杂的配置对象和各类配置函数，而是通过提供 Metadata（元数据）给 Angular，由框架自动识别并处理。

说到 Metadata，我们很容易想到的方法就是已经进入 Stage 2 的 Decorator 语法。不过，除了语法糖，我们真正有哪些方式来提供 Metadata 呢？本文中将会列举提供 Metadata 的方式，为了避免不必要的语法噪音，所有方式都采用当前版本的 JavaScript 作示例，因此所有代码也都能够无需任何预处理直接以 <script> tag 的方式在（最新的 Chrome 或同级别的）浏览器中运行。

*本文仅以 Component Metadata 作为示例，适用于所有 Class Metadata。*


## Helper Methods

说到 JavaScript 中提供 Metadata 的方式，最容易找到的就是 JavaScript 版本文档中所给出的 Helper Methods 的方式，通过链式调用的 API 来模拟 Decorator：

```javascript
AppComponent =
  ng.core.Component({
    selector: 'my-app',
    template: '<h1>Hello Angular</h1>'
  })
  .Class({
    constructor: function() {}
  });
```

[在线示例](https://embed.plnkr.co/kk4V4SbEmkGUXkXyWHJI/)请点击此处查看。


## Decorator Application

我们知道，Decorator 在语义上就只是一个函数调用。因此，即便不依靠 Decorator 语法，我们也能够手动进行函数调用达到相同的效果：

```javascript
class AppComponent {
  
}

ng.core.Component({
  selector: 'my-app',
  template: '<h1>Hello Angular</h1>'
})(AppComponent);
```

[在线示例](https://embed.plnkr.co/NdpPVgLLJaZ7IkKmB4uJ/)请点击此处查看。


## Reflect Operation

上面的函数调用仍然不是本质，在 Angular 的 Decorator 函数内部，是通过调用 Reflect 的相关方法来对类型添加 Metadata 的，我们也可以手动实现这一过程：

```javascript
class AppComponent {
  
}

Reflect.defineMetadata(
  'annotations', 
  [
    new ng.core.Component({
      selector: 'my-app',
      template: '<h1>Hello Angular</h1>'
    })
  ], 
  AppComponent
);
```

[在线示例](https://embed.plnkr.co/GC5FR9QKes4P2ztbKX0X/)请点击此处查看。


## Static Annotations

除了上面的方式外，我们也能使用使用类的静态属性来提供 Metadata，其中的一种方式是通过 `annotations` 属性：

```javascript
class AppComponent {
  static get annotations() {
    return [
      new ng.core.Component({
        selector: 'my-app',
        template: '<h1>Hello Angular</h1>'
      })
    ];
  }
}
```

[在线示例](https://embed.plnkr.co/r99zg8aqPgp2qBuEUFH0/)请点击此处查看。

*PS: 当前版本的 JavaScript（即 ECMAScript 2016）中并不存在 Static Value Property 的语法，只有 Static Method 和 Static Accessor Property。*


## Static Decorators

另一种使用静态类属性的方式是通过 `decorators` 属性，不过使用方式略有不同：

```javascript
class AppComponent {
  static get decorators() {
    return [{
      type: ng.core.Component,
      args: [{
        selector: 'my-app',
        template: '<h1>Hello Angular</h1>'
      }]
    }];
  }
}
```

[在线示例](https://embed.plnkr.co/JaCQA9ARAIpcmnTKdGXg/)请点击此处查看。


## 总结

+ 虽然看起来有很多种方案都能够提供 Metadata，不过实质上的方法只有三种。*猜猜哪三种是基本方式？*
+ 语法糖虽然不能提供新的功能，但还是能够让代码更佳简洁优雅。
+ 了解语法糖背后的实质也很重要。
