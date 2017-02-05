# ng-container 简介

写在前面：

+ 如无特殊说明，本文中所有 Angular 均指代 Angular 2+ 版本。

在 Angular 中，我们经常可以见到类似于如下的代码：

```html
<xxx>
  <ng-container *prop="whatever">
    ...
  </ng-container>
</xxx>
```

这里我们可以见到一个特殊的元素名：`ng-container`。那么，这个 `ng-container` 到底是一个什么样的东西，起着什么样的作用呢？


## What is ng-container?

`ng-container` 既不是一个 Component，也不是一个 Directive，只是单纯的一个特殊 tag。

这点类似于 `template`，Angular 复用了 HTML5 规范中 `template` 的 tag 的语义，不过并没有真正利用其实现，因此在审查元素中是永远也找不到一个 `template` 元素的。

不过，由于 `ng-container` 并不是 HTML5 中的，为了保持区分度，采用了 `ng-` 作为前缀。所以现在我们可以知道，`ng-container` 是 Angular 所定义的一个特殊 tag。


## What does ng-container do?

我们可以先简单尝试一下在模版中使用 `ng-container`，类似于：

```html
<div>
  <ng-container>
    <p>This is paragraph 1.</p>
    <p>This is paragraph 2.</p>
  </ng-container>
</div>
```

*运行效果可以参见[在线示例1](http://embed.plnkr.co/bjiLdGS8XhGpgeFoCZEW/)。*

我们可能会对运行结果很惊讶，因为渲染出来的实际内容仅仅是：

```html
<div>
  <p>This is paragraph 1.</p>
  <p>This is paragraph 2.</p>
</div>
```

我们可能会感到一些失望，因为除了 `ng-container` 不见了之外，什么事情都没有发生。

没错，这就是 `ng-container` 所具备的唯一功能：不存在的功能。（注意断句）


## Why we need ng-container?

上面我们说到，`ng-container` 唯一的功能就是让自己消失，那么它到底有着什么样的应用场景呢？

对于接触过 AngularJS 1.x 的童鞋来说，会知道 Directive 有一个 `multiElement` 属性，能够使得其并不应用在某个特定元素上，而是应用在某一段元素集合的范围中。

*万一有不知道的可以参考 [AngularJS 1.x 的 API](https://docs.angularjs.org/api/ng/service/$compile#-multielement-)。*

一个最常用的例子就是 ngRepeat，可以 `ng-repeat-start` 和 `ng-repeat-end` 来重复多个元素（并且不使用额外元素包装），类似于：

```html
<ul class="book-list">
  <li class="book-item" ng-repeat-start="book in books">{{ book.name }}</li>
  <li class="book-item">{{ book.author }}</li>
  <li class="book-item" ng-repeat-end>{{ book.price }}</li>
</ul>
```

这里，假设我们要求 `li` 必须是 `ul` 的直接子节点，而每个循环项又需要具备多个 `li` 节点，这是我们就可以使用 multiElement 的方式，直接匹配一个连续的元素集合。

而在 Angular 2+ 中，我们直接使用 selector 来指定 Directive 的宿主，而 selector 是没有进行区域选择的功能的，于是不能使用类似于 AngularJS 1.x 的方式来实现这个操作。

不过，现在我们有一个好消息，我们有一个永远都不会真实存在的 tag，也就是 `ng-container`，我们可以利用这一点来实现我们的需求：

```html
<ul class="book-list">
  <ng-container *ngFor="let book of books">
    <li class="book-item">{{ book.title }}</li>
    <li class="book-item">{{ book.author }}</li>
    <li class="book-item">{{ book.price }}</li>
  </ng-container>
</ul>
```

*运行效果可以参见[在线示例2](http://embed.plnkr.co/pAJ2xSaVSZtiXsigBfVK/)。*

虽然看起来我们使用了 `ng-container` 进行了包装，但是由于其永远不存在的特性，`ul` 下面的节点就直接是 `li` 节点了，于是我们可以直接把循环项展开为多个元素。

另一个 AngularJS 1.x 中常见的场景是在同一级元素上同时使用 ngIf 和 ngRepeat，类似于：

```html
<div>
  <p ng-repeat="item in items" ng-if="item.available">{{ item.name }}</p>
</div>
```

虽然从实现上而言这种做法是完全不必要的，但是由于书写上的简便性仍然被大量使用。

而在 Angular 2+ 中，正如我们在 [Structural Directive](https://wx.angular.cn/library/article/Angular2%E4%B8%AD%E7%9A%84StructuralDirective) 中所介绍的那样，从翻译规则上就可以确定一个元素上绝不可能同时使用多个星号语法糖。

而有了 `ng-container` 这个不存在的包装元素之后，我们就实现同样的效果：

```html
<div>
  <ng-container *ngFor="let item of items">
    <p *ngIf="item.available">
      {{ item.name }}
    </p>
  </ng-container>
</div>
```

*运行效果可以参见[在线示例3](http://embed.plnkr.co/hR3FbldJ3Jd4A3VCEHXk/)。*

这样就可以不借助包装元素同时使用 ngFor 和 ngIf 了，并且逻辑层次上也更加清晰。


## 总结

"不存在的功能" 也是一个相当强大的功能的哦，千万不要小看它。
