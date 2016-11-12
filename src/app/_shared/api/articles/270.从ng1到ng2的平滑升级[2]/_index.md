如果你已经看过了前一篇文章，相信你对升级的套路已经有了一定的认识，我们来一起简单总结一下吧：

1. 拆分ng1框架代码和业务代码，并将框架代码集中至一个或几个文件中；
2. 解除对ng1中`$scope`的依赖，将业务代码剥离为一个普通的方法；
3. 使用typescript语法（包括`class`、`constructor`、`import`、`export`等），将es3代码升级至typescript版本；
4. 根据最佳实践优化typescript代码；
5. 添加必要的ng2元素，将代码升级至ng2版本。

> 即使暂时没有升级至ng2的计划，利用上述方法中的前4个步骤，依然可以很好地帮助你重构现有代码，解耦对ng1的依赖，也为未来可能出现的代码重用、迁移、测试等带来很大的方便。

下面我们一起来接受新的挑战吧。

# 二、升级service/factory/provider

> 关于service、factory、provider：相信你在使用ng1的时候一定对这三个概念产生过困惑，网上也有很多相关文章讨论三者之间的差别和联系。但稍微深入研究一下就会知道，这三者本质相同，只是做了不同的语法糖包装。本文以service为例完成升级过程。

首先来定义一个项目中用到的service：

```
// user.service.js
// 一个简单的service，用来获取用户列表

app.service('UserService', ['$http', function ($http) {
  var service = {};
  
  // 这里假定了一个api地址：/user
  service.listUser = function () {
    return $http.get('/user').then(function (res) {
      return res.data;
    });
  };
  
  return service;
}]);
```

## 1、分离框架代码和业务代码

与controller的升级类似，我们先将业务代码剥离成一个单独的文件，并将所有注册service代码集中到一个文件中。

```
// app-service.js
// 这个文件专门用来注册所有的service

app.service('UserService', ['$http', userService])
   .service('ArticleService', ['$http', articleService])
   .service(...);
```

```
// user.service.js

var userService = function ($http) {
  var service = {};
  
  service.listUser = function () {
    return $http.get('/user').then(function (res) {
      return res.data;
    });
  };
  
  return service;
};
```

经过了前一篇文章的洗礼，这一步对你来说应该是易如反掌。

## 2、根据最佳实践处理依赖

但是和controller不同的是，这个service中所依赖的`$http`并不像`$scope`一样可以通过某种语法，从方法中完全解耦，有时候我们也必须面对这个事实，一些框架相关的API确实必须一定程度的参与到业务代码中。

不过好在这个依赖是通过DI的方式注入到方法中，方法也并没有直接对ng1产生依赖，因此到这里为止，关于`$http`这个依赖就这样处理也无伤大雅。

不过编写代码我们总希望能够尽可能优化代码。

这里我们会发现一个问题，如果今后`userService`的依赖，除了`$http`外又增加了`$log`依赖，这时你就必须同时修改`app-service.js`文件和`user.service.js`文件两个文件。一处调整涉及到两处修改并不符合最佳实践。设想在多人团队合作的项目中，不同人负责的多个service代码都调整了依赖内容，则会导致`app-service.js`文件被多个人同时修改，在通过版本控制软件提交时也会增加代码review的难度。

> 最佳实践：我们希望将service的依赖内容与service代码放在同一处，减少依赖调整所带来的文件修改数量，这也一定程度上符合高内聚和单一职责原则。

ng1为我们提供了一种实现方式：`$inject`。（官方文档：[https://docs.angularjs.org/api/auto/service/$injector](https://docs.angularjs.org/api/auto/service/$injector)）

简单来说，我们将一个__字符串数组__作为`$inject`属性赋值给一个方法，ng1就会按照数组中的字符串对方法注入依赖，我们来看一下代码：

```
// user.service.js

// 这里我们假设service增加了一个$log依赖
var userService = function ($http, $log) {

  var service = {};
  
  service.listUser = function () {
    return $http.get('/user').then(function (res) {
      return res.data;
    });
  };
  
  return service;
};

// 这里使用$inject属性对service注入依赖
userService.$inject = ['$http', '$log'];
```

通过这种方式，需要注入的依赖就在service文件中声明完成。

同时注册service的代码也可以做相应的简化：

```
// app-service.js

// 由于在service文件中已经声明了service所需要的依赖，因此这里直接将service方法作为参数即可
// 注意：这里不再需要将第二个参数写成数组形式
app.service('UserService', userService)
   .service('ArticleService', articleService)
   .service(...);
```

> 结合上一篇中定义的controller，我们也可以使用相同的方式，在controller方法上定义一个`$inject`属性来声明依赖，这种声明方式可以用在包括ng1自有依赖和项目自定义service的各种依赖上。因此，理论上来说，在注册controller、service等各类组件时，均可以达到“仅注册，不声明依赖”的目的。

## 3、向typescript进发

和之前一样，我们也需要将es3代码升级为typescript代码。

```
// user.service.ts

// 原来的service方法以class的方式定义
export default class UserService {

  // 这里我们使用static关键字，直接对service类添加静态属性$inject
  static $inject : string[] = ['$http', '$log'];

  // service的依赖通常都不需要在外部调用，因此这里我们声明为私有属性
  // 这里我们将属性名中的$符号去除，减少ng1的痕迹
  constructor (private _http : any, private _log : any) {
    // 在constructor的参数里使用public、private、protected等关键字声明的参数，
    // 将被typescript自动定义为同名类属性
    // 相当于执行了代码：this._http = _http;，因此不需要手动赋值
  }
  
  listUser () : Promise<any[]> {
    // 使用this._http来调用依赖
    return this._http
               .get('/user')
               .then((res : any) : any[] => res.data);
  }

}
```

```
// app-service.ts

import app from './app';

import UserService from './user.service';
import ArticleService from './article.service';
...

app.service('UserService', userService)
   .service('ArticleService', articleService)
   .service(...);
```

## 4、升级为ng2

升级前的重构准备工作都做完了，升级至ng2就指日可待啦。

```
// user.service.ts

import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// 这里假设已经在项目中定义了User类型
// 如果没有定义，后面的User类型使用any来暂时代替也尚无不可
import User from './user.model';

@Injectable
export default class UserService {

  // 这里不再使用ng1的注入方式，而通过在AppModule注解的imports属性引入HttpModule
  // 不过即使保留这个静态属性，也不会对ng2的运行产生影响
  // 虽然保留下来并不是较好的习惯，但也在一定程度上减少升级工作量
  // static $inject : string[] = ['$http', '$log'];
  
  // ng2中通过参数类型来判断依赖的服务
  // 这里省略$log依赖
  constructor (private _http : Http) {
  
  }
  
  // ng2中默认使用rxjs的方式调用http方法，
  // 如果不习惯，可以通过toPromise()方法将Observable转换为Promise
  // 虽然推荐使用rxjs，但是转换为Promise类型可以降低依赖该服务的其他组件的升级成本
  listUser () : Observable<User[]> {
    return this._http
               .get('/user')
               .map((res : Response) : User[] => res.json() as User[]);
  }
  
}
```

## 5、关于value和constant

如果说service、factory、provider比较类似——至少都可以注入依赖并通过function（es3）或class（typescript）来完成定义，那么value和constant就有点不太一样，因为它们就只是一个值而已啊。

这时你可以通过这样来实现：

```
let someValue : any = { foo : 'bar' };

export default someValue;
```

或者这样：

```
const PI = 3.1415926;

export default PI;
```

但是这样把每个不同的value或constant分散管理在不同的文件中，显然也是比较麻烦的。因此，这里我们建议您将各种值均设置在一个service中统一管理，例如`ValueService`和`ConstantService`，这样在ng2中也比较方便升级和维护。

依旧留一道练习题：把上次使用的controller/component和今天的service组合在一起试试吧。

（未完待续）

