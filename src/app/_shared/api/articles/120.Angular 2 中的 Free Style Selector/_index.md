# Angular 2 中的 Free Style Selector

在 Angular 2 中，我们几乎会为每个 Component 实体类型的 Component 装饰器工厂函数的 Component 参数（曾经是 ComponentMetadata，rc7 开始直接就是 Component 了）配置 selector 属性，从而指定该组件的宿主所在。

这十分类似于我们在 Angular 1.x 中使用的 Directive/Component 名称和 restrict 属性的组合，即：

```typescript
angular.module('app')
  .directive('myDir', () => ({ restrict: 'EA' }))
```

## In Angular 1.x

但是，在 Angular 1 中，存在着这样一些问题：

1. 每个 Directive 只能有一个名称作为标识符，无法组合；
2. 所有的标识符都必须使用 kebab-case 的标签名或属性名；
3. 不能够存在同标识符的多个 Directives。

如果读到这里没有任何的违和感那就不太好了哟，实际上上面的这个列表是一个 "两真一假" 的小游戏，
大家可以猜猜看哪一个问题是假的呢？猜完再继续哦～


--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  
--- 这里是缓冲区 ---  

实际上，1 和 2 是真的，而 3 是假的。

Angular 1.x 中每个 Directive 都有且只有一个标识符（虽然这个标识符可以以多种形式出现），
如果我们想要满足多个标识符组合（比如 a 标签和 href 属性）才应用某个 Directive，是无法做到的。
当然可以有一些 Workaround 方案，比如选择一个主要标识符，比如 a 标签，然后在相应实现的地方加判断，
如果某个实例具备 href 属性才真正生效，否则什么都不做。

对于第二点而言则是实现的必然要求，Angular 1.x 使用了 DOM-based template，即先将模版内容交由浏览器渲染，
而后再对渲染出的 DOM 对象进行扫描，而后根据扫描结果执行相应操作。
而由于 HTML 本身是大小写不敏感的，所以如果直接在 HTML 中使用 camelCase 的话无法和 JavaScript 中的代码一一对应，
因此增加了 kebab-case 到 camelCase 的转换。

第三点是我瞎编的，但可能有人真的会这么以为，这多半是受到 Service 注册的影响。对于 Service 而言，
如果有同名的 Service 注册，后注册的会覆盖之前注册的；但对于 Directive 来说，如果有多个同名的 Directive，
则会共同作用，并不会发生覆盖。


## In Angular 2

到了 Angular 2 之后，我们就可以使用一个通用的 CSS 选择器（的某真子集）来作为应用的条件。这样做有什么用呢？

又到了脑筋急转弯时间了，现在的问题是：

**在 Angular 2 的路由中，我们在需要触发路由跳转的地方使用 routerLink 这一个 Directive，对么？**

--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  
--- 这里又是缓冲区 ---  

不过这里可能从用词上就能够猜的出来问题在哪。

事实上，routerLink 并不是一个 Directive，而是两个 Directives：
[RouterLink](https://angular.io/docs/ts/latest/api/router/index/RouterLink-directive.html) 和
[RouterLinkWithHref](https://angular.io/docs/ts/latest/api/router/index/RouterLinkWithHref-directive.html) 。

当我们在不是 a 标签的元素上添加 routerLink 属性时，使用的是前一个 Directive，其 selector 为 `:not(a)[routerLink]` 。

而当我们在 a 标签上添加 routerLink 属性时，使用的则是后一个 Directive，其 selector 为 `a[routerLink]` 。

有没有很神奇？


另外，对于 NgFor 这样使用 asterisk DSL 来自定义表达式的 Structural Directive，也可以带来额外的好处，就是可以同时支持多个不同的表达式。

比如对于 `*ngFor="let item of items trackBy trackByFn"`，其实际的翻译结果为：

```html
<template ngFor 
          let-item="$implicit" 
          [ngForOf]="items" 
          [ngForTrackBy]="trackByFn">
          ...
</template>
```

因此其 selector 为 `[ngFor][ngForOf]`，只有某个元素同时具备这两个属性时才会应用这个 NgFor 的 Directive。

所以实际上我们也可以同时实现另一个 NgFor，比如就是看不惯政治正确就用 `*ngFor="let item in items trackBy trackByFn"` 这样。
（当然实际上这里因为不是 ng 自带的东西不应该使用 ng 作为前缀）

虽然看上去都是通过 ngFor 这个属性，但实际上并不会发生任何冲突。

最后，当然因为现在不是 DOM-based template 了，用的自己的 Parser，所以也就不会有大小写的问题。
在一般情况下，标签名会使用 kebab-case，这是 Web Components 中的 Custom Element 规范（草案）的要求；
而属性名会使用 camelCase，这样就能和我们的 JavaScript 代码相统一，从而可以直接使用属性访问来交互。

## 最后

虽然现在不用 jQuery 了，但是 CSS selector 仍然是很有用的东西哟，不熟的童鞋们可以了解一下（某些冷门的 selector 规则）哟～
