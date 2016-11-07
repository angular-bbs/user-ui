如果你想了解如何将现有的AngularJs 1.X（简称ng1）的项目平滑升级至Angular 2.X（简称ng2），这篇文章或许会对你有帮助。

本文假设你原有的ng1项目有如下属性：

1. 使用的ng1版本为1.2.X+；
2. 使用的Javascript版本为es3或少量es5特性；
3. 暂时不考虑其他外部依赖，例如第三方ng1插件等；
4. 如果你有一些es6的知识，阅读本文将会更加轻松。

本文的目标是：

1. 将ng1升级至ng2，为了实现平滑升级，我们还将尽量在升级过程中把步子迈小，同时使升级后的代码兼容ng1，从而在升级过程中不影响当前项目的正常开发和发布；
2. 将Javascript升级至Typescript，平滑升级过程中还可以生成兼容ng1的typescript版本代码；
3. 尽量尝试使用最佳实践。

让我们开始吧！

# 〇、一个典型的ng1项目

我们先来定义一个在本文中一直会使用到的ng1项目基础代码，后面的代码实例都基于这个基础代码开发。

```
// app.js
/* 定义一个ng1 module，并假设该module为ng1项目的启动module，例如在html标签中添加 ng-app="app" */

var app = angular.module('app', []);
```

这个项目至少还要有一个controller

```
// index.controller.js
/* 一个简单的controller */

app.controller('IndexCtrl', ['$scope', function ($scope) {
  $scope.info = 'hello world';
  
  console.log($scope.info);
}]);
```

我们还要有一个html页面。

```
<!-- index.html -->

...
<div ng-app="app">
  <div ng-controller="IndexCtrl">
    <span ng-bind="info"></span>
  </div>
</div>
...
```

这样，一个最简单的ng1项目就完成了。

# 一、从一个最简单的Controller开始

我们从最常使用的controller开始下手。首先回顾一下刚才定义的controller。

```
// index.controller.js
/* 一个简单的controller */

app.controller('IndexCtrl', ['$scope', function ($scope) {
  $scope.info = 'hello world';
  
  console.log($scope.info);
}]);
```

仔细查看代码，我们可以发现，我们定义controller的方式使用的是`angular.Module.controller`方法，这样的定义方式与ng1完全耦合在一起，无法脱离ng1的依赖，因此，第一步我们现在将controller实体function从该方法中剥离出来。

## 1、分离controller的实体function

分离的方式很简单，我们定义一个function变量，再将该function变量写在`angular.Module.controller`方法中。

```
// index.controller.js
/* 一个简单的controller */

app.controller('IndexCtrl', ['$scope', indexCtrl]);

var indexCtrl = function ($scope) {
  $scope.info = 'hello world';
  
  console.log($scope.info);
};
```

但是这样做还是不够，因为Index.controller.js文件中还是调用了app.controller方法，这个方法是ng1专有的，因此这个文件还是在依赖ng1，因此我们可以将所有使用`app.controller`方法注册controller的代码集中到一个`app-controller.js`中。

这样，我们将index.controller.js文件拆分成两个文件。

```
// app-controller.js

app.controller('IndexCtrl', ['$scope', indexCtrl])
   .controller('LoginCtrl', ['$scope', loginCtrl])
   .controller(...);
```

```
// index.controller.js

var indexCtrl = function ($scope) {
  $scope.info = 'hello world';
  
  console.log($scope.info);
};
```

修改之后的代码就清晰多了，`app-controller.js`专门负责注册项目中所有用到的controller，`index.controller.js`以及其他的类似`login.controller.js`等专门负责完成controller中的业务逻辑和交互逻辑。

> 这里有一个问题要注意，因为`app-controller.js`中要调用`indexCtrl`这个变量，因此一定要在调用之前定义这个变量，否则调用时`indexCtrl`为`undefined`。避免这个问题的方法，一种是在html中引用js文件时首先引用定义indexCtrl的js文件，最后引用`app-controller.js`文件；第二种是使用typescript中的模块管理功能管理相互之间的依赖。本文最终会形成typescript版本的代码，所以这个问题仅在改动过程中出现。

## 2、不再使用丑陋的$scope

`index.controller.js`中的代码使用了`$scope`，而`$scope`是使用DI的方式注入到方法中，因此这里并没有对ng1产生直接的依赖，这也是依赖注入的一大好处。

但是controller方法中到处充满了`$scope`，不得不说代码会显得很混乱和丑陋。如果你对ng2有一些了解，那么应该知道ng2中是没有`$scope`概念的。为了升级至ng2，我们从现在开始对`$scope`说NO！

ng1中提供了一种可以避免使用`$scope`的方式，那就是`as`语法，我们先来看一下如何使用。

```
<!-- index.html -->

...
<div ng-app="app">
  <div ng-controller="IndexCtrl as $ctrl">
    <span ng-bind="$ctrl.info"></span>
  </div>
</div>
...
```

```
// index.controller.js

var indexCtrl = function () {
  this.info = 'hello world';
  
  console.log(this.info);
};
```

```
// app-controller.js

app.controller('IndexCtrl', [indexCtrl])
   .controller('LoginCtrl', [loginCtrl])
   .controller(...);
```

使用`as`语法，相当于在`$scope`中定义了一个属性`$ctrl`，并将这个属性指向`indexCtrl`方法作用域的`this`上，具体可以参见官方文档（[https://docs.angularjs.org/api/ng/directive/ngController](https://docs.angularjs.org/api/ng/directive/ngController)）。

因此，使用`as`语法后，controller方法就可以使用`this`来操作其中的变量，这样几乎与ng2中`Component`类的操作方法一致，在注册controller时也不用注入`$scope`依赖了。

同时在html中，调用controller方法中的变量时，需要使用`$ctrl.foobar`来实现（因为`$ctrl`为`$scope`的一个属性）。

> 这里使用的`$ctrl`属性可以根据需要调整名称，如`ctrl`、`indexCtrl`等，但统一使用`$ctrl`是最佳实践，一方面可以在所有html的controller中统一使用相同的属性名调用controller中的变量，另一方面使用$前缀可以作为ng1的一个标记，避免出现变量名冲突的情况。

这时我们再重新观察一下`index.controller.js`文件，它已经完全纯净，只是一个非常普通的方法，一点ng1的影子都看不出来了。

```
// index.controller.js

var indexCtrl = function () {
  this.info = 'hello world';
  
  console.log(this.info);
};
```

## 3、向es6及typescript进发

我们现在的js代码还停留在es3阶段，要靠近ng2，我们还需要使用typescript。

> 升级至typescript后，需要使用typescript compiler（[http://www.typescriptlang.org/](http://www.typescriptlang.org/)）编译为es3或es5版本。

> 注意：虽然代码升级为typescript，但仍然可以在编译后兼容ng1。

这里，我们使用typescript中的`class`来定义`indexCtrl`。

```
// index.controller.ts
// 为变量增加类型声明，同时也就不用再判断变量类型了
 
export default class IndexCtrl {
  info : string = 'hello world';
  
  constructor () {
    console.log(this.info);
  }
  
  // 这里我们为controller添加一个可以在html中调用的方法
  hasInfo () : boolean {
    // 使用了typescript，这里就可以省略类型判断了
    return this.info.length > 0;
  }
}
```

我们使用以下几种方式实现`IndexCtrl`：

1. 之前使用`this`定义的变量，我们在class的最顶端使用`foo = 'bar'`的方式声明为类属性；
2. 初始化工作在class中的`constructor`中完成;
3. 需要在html中调用的方法使用`foo () {}`的方式生命为类方法。
4. 代码中`export default`使用了typescript中的模块管理功能，将类导出，并可以在其他文件中调用。

类似的，我们将其他文件也做相应的优化。

```
// app.ts

export default angular.module('app', []);
```

```
// app-controller.ts
// 这里使用import调用其他模块，从此就不用担心变量是否已定义的问题啦

import app from './app';

import IndexCtrl from './index.controller';
import LoginCtrl from './login.controller';
...

app.controller('IndexCtrl', [indexCtrl])
   .controller('LoginCtrl', [loginCtrl])
   .controller(...);
   
// 这个文件不需要其他文件调用，因此不需要export模块
```

```
<!-- index.html -->

...
<div ng-app="app">
  <div ng-controller="IndexCtrl as $ctrl">
    <span ng-bind="$ctrl.info" ng-if="$ctrl.hasInfo()"></span>
  </div>
</div>
...
```

虽然到此为止，代码在typescript下编译完成后，仍然可以生成兼容ng1的es3版本js代码。

## 4、根据最佳实践进一步优化

这里有一些最佳实践，我们可以用来参考。

> 最佳实践：我们建议在`constructor`中，只对一些变量的值进行初始化，不执行具体的业务逻辑（例如本文中的`console.log(this.info)`），而将涉及到业务逻辑的初始化，则放到单独的初始化方法中完成。

这个最佳实践也正符合ng2的理念，在ng2中，每个component都有一系列生命周期方法，并通过ng2框架自动调用运行，我们涉及到业务逻辑的初始化工作在这里拆分到单独的初始化方法中，将更方便我们的代码升级至ng2。

```
// index.controller.ts
// 接下来优化typescript版本
 
export default class IndexCtrl {
  info : string = 'hello world';
  
  constructor () {
    this._onInit();
  }
  
  // typescript中，类的方法默认为public类型，因此不需要显式声明
  hasInfo () : boolean {
    return this.info.length > 0;
  }
  
  // 这里我们将初始化方法同意命名为_onInit
  // 这里用typescript中的private关键字将方法声明为私有方法
  private _onInit () : void {
    console.log(this.info);
  }
}
```

> 最佳实践：初始化方法并不需要在网页中或其他模块中调用，因此我们将其设定为私有方法（以`_`开头），并写在所有公开方法后面。

## 5、升级为ng2

到此为止，虽然我们对项目的修改已经如此巨大，但它依然可以兼容ng1（在typescript compiler帮忙编译的情况下），而代码却已经变得整洁而先进，对你现有的项目的运行完全没有任何影响。

准备工作做的这么充分，升级至ng2就指日可待啦。

```
// index.component.ts
// ng2中没有controller概念，我们将controller改造为component

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'index-ctrl',
  template: '<span *ngIf="hasInfo()">{{ info }}</span>'
})
export class IndexComponent implements OnInit {
  info : string = 'hello world';
  
  constructor () {
    // 初始化方法为生命周期方法，由ng2框架自动调用，这里不需要手动调用
  }
  
  hasInfo () : boolean {
    return this.info.length > 0;
  }
  
  // 这里用ng2中的生命周期方法
  ngOnInit () : void {
    console.log(this.info);
  }
}
```

改到这里，`index.component.ts`的ng2升级就完成了，我们可以看到，除了添加一些annotation以外，component的核心代码几乎没有变动。

这说明经过优化的、完全兼容ng1的typescript版本核心代码（也就是此步骤之前的所有重构工作），可以直接升级至ng2，之要添加一些必要的annotation就可以了。有木有很平滑！

`ngModule`的ng2升级就留给你做练习吧。

（未完待续）
