# 单例模式与Angular

本文简单介绍单例模式的概念和作用，并结合Angular的依赖注入了解Angular中的单例模式用法。

本文力求用通俗易懂的语言描述，如有不严谨的地方还请多多指教。

## 没有单例模式的日子

通常我们定义一个类之后，会使用`new`关键字来创建一个类的实例，也就是对象。那么只要调用一次`new`关键字，就会生成一个全新的实例。

虽然每个实例都是由同一个类创建出来的，但是每个实例之间没有任何关联，修改、删除其中一个实例的属性，其他实例不会受到影响。

这里用一小段代码来直观的说明。

```typescript
// user.model.ts

// 这里定义一个User类，其中name和age两个属性
export default class User {

  name : string;
  age : number;

  constructor (name : string, age : number) {
    this.name = name;
    this.age = age;
  }

}
```

```typescript
// main.ts

import User from './user.model';

// 这里使用new关键字创建两个user实例
const user1 = new User('Li Lei', 18);
const user2 = new User('Han Meimei', 17);

console.log(user1.name); // Li Lei

// 这里我修改user1的name属性，user2的name属性完全没有受到影响
user1.name = 'Jim Green';

console.log(user1.name); // Jim Green
console.log(user2.name); // Han Meimei
```

这段代码看起来理所应当，完全没有可讨论的价值。也正是因为如此，我们才忽略了单例模式的作用和重要性。

## 单例模式的概念

顾名思义，单例模式就是某个类在**一定范围**内只有**一个实例**。

这句话该如何理解呢？

在所谓的**一定范围**内，无论怎样获取类的实例，每次都只能得到**同样的实例**，无法获得与已有实例不同的新实例。从而确保了，在这个**一定范围**内，大家共用**同一个实例**，如果对这个实例进行修改，则会影响到所有使用该实例的代码。

不知大家是否已经感觉到，这样的说法，非常类似**全局变量**这样一个存在。

因此上面所谓的**一定范围**，**通常**就是指**全局范围**。

使用单例模式的类的基本逻辑是这样的：

1. 没有公共的构造函数（`public constructor`），因此不能使用`new`关键字创建新实例;
2. 有一个专用于获取实例的静态方法，通常命名为`getInstance ()`（`static getInstance ()`）;
3. 在这个方法中，判断当前是否已经有该类的实例。如果没有，则创建一个新实例（创建出来的实例就是唯一的实例）；如果有，则返回该实例（确保没有新的实例被创建和返回）。

如果想了解实现单例模式的代码，可以参见本文最后一节。

## 单例模式的作用

### 存放全局变量

刚才从单例模式的概念和实现逻辑上，我们已经感觉出，单例模式很适合在全局变量上使用。

全局变量自然要在整个应用中的各处都保持一致，使用单例模式再合适不过。因此应用中的全局变量或全局方法，皆可以存放于使用单例模式的类中，确保全局一致。

### 节省内存开销

既然使用单例模式的类只存在一个实例，因此也就不会因为创建过多新实例而导致这些实例占用过多的内存。

单例模式的类实例永远只占用一个实例的内存开销。

试想如果有一个类，无论创建多少个新实例，实例之间都没有本质差别，这种情况下自然无需创建多个实例，只要有一个实例就足够。

在实际的应用中，service类多半即为这种情况。

因为service的功能被设计为处理业务逻辑，大多情况下service中只存放处理业务逻辑的方法，不存放具体的属性值，且处理业务逻辑的方法不会因为实例的不同而发生变化。

由此可见，即使大多情况下service类不使用单例模式也可正常运行，但使用单例模式无疑可以减少应用内存开销，提升运行效率。

### 业务需求确保全局唯一

某些情况下，如果业务要求全局必须只有唯一一个实例，这时就必须使用单例模式来实现。

例如在网站中缓存当前登录用户的对象，无论页面如何跳转，该登录用户必须最多只存在一个，如果用户登出并重新以另一用户身份登录，也不允许同时存放登出前和再次登录后两个不同的用户对象。且如果登录用户的属性发生了变化（例如用户修改了昵称），全局都要使用新属性值。

## Angular中的单例模式

如前所说，service类很适合使用单例模式实现。而Angular中的service正是使用单例模式的方式注入（依赖注入可参考[这篇文章](http://mp.weixin.qq.com/s/RXrjqwQj41rqlXZj2Z-w7w)）到调用者中。

在Angular中，各类组件之间的相互依赖均使用依赖注入的方式相互调用，在设计良好的Angular项目中，几乎不会使用到`new`关键字来创建实例，所有的实例均交由Angular框架来帮你完成。

因此即使我们不了解单例模式的概念，也从没写过单例模式的实现代码，我们也从未在Angular中离开过单例模式的使用。

## Angular中单例模式的使用

在Angular中，单例模式使用`providers`来实现，我们先看一段代码。

```typescript
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';

import AppRootComponent from './app-root.component';
import UserService from './user.service';

@NgModule({
  bootstrap: [ AppRootComponent ],
  declarations: [ AppRootComponent ],
  imports: [ BrowserModule ],
  // 这里的providers就是使用单例模式注入service的用法
  providers: [ UserService ]
})
export default class AppModule {
}
```

如上段代码所示，在`AppModule`中通过`@NgModule`装饰器中的`providers`属性供应了`UserService`，那么在**`AppModule`的范围内**，`UserService`即为单例模式，`AppModule`中无论在哪个组件中注入`UserService`，均为**同一实例**。

然而，`providers`属性不仅在`@NgModule`装饰器中存在，在`@Component`装饰器、`@Directive`装饰器中都有，我们该如何使用这些`providers`属性呢？

## Angular中`providers`的使用

在单例模式的概念中，我们反复强调过，单例模式是在**一定范围**内生效的，通常情况下，我们所谓的**一定范围**指的就是全局范围，但某些应用中我们需要在一个非全局范围的小范围内使用单例模式，超出这个范围的实例则使用新实例，而不是范围内已存在的单例。

Angular为我们提供了非常方便的限定单例模式适用范围的使用方法。

在Angular中，使用`providers`属性供应类单例，因此单例的适用范围即为`providers`属性所在的装饰器的范围。

也就是说，如果我们在`@NgModule`装饰器中使用`providers`属性供应某个类的单例，则在该module的范围内，所有组件注入的该类实例均为该单例；而在其他module中再注入该类实例，则为新的实例。`@NgModule`范围内的单例模式，非常类似于全局范围的单例模式，尤其是应用的根module中的单例。

同理，在`@Component`装饰器中使用`providers`属性供应某个类的单例，则在该component的范围内有效，其他component中再注入该类实例，则为新的实例。使用`@Directive`装饰器亦为如此。这种情况下即为小范围内的单例模式。

那么什么时候才会用到小范围内的单例模式呢？

这种情况比较少见，Angular的官方文档也建议我们将service直接在`@NgModule`装饰器的`providers`属性中供应（官方文档：[https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-component-or-module](https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-component-or-module)）。

因此，除非你很确定某个service必须仅限于某个组件中使用，否则建议直接将该service放置在module的`providers`属性中。

除此之外，Angular中还有一些较为复杂的注入单例的情况：嵌套注入、懒加载注入、外部模块导入注入等，由于这些情况下的注入单例规则较为复杂，各位可查看这篇[专门讲述这些情况的文章](http://mp.weixin.qq.com/s/hDQsllMQwkJjBh5Mhuyt3A)。

## 总结

说到这里，单例模式和Angular之间的关系已经说得差不多了，本文对单例模式及其在Angular中的应用做了简单的探讨，希望能够抛砖引玉。

如果我们不了解单例模式和Angular之间的关系，则可能在某些情况下出现奇怪的错误。

例如我们在两个无关组件的`@Component`装饰器中提供了相同的全局变量service，则其中一个组件修改了全局变量，另一个组件则无法感知到，导致无法在页面中正常更新相关显示内容。

下面提供了一些扩展阅读内容，帮助你更好的理解本文的相关内容。

## 扩展阅读：AngularJS 1.x中的单例模式

AngularJS 1.x中的service（包括provider/factory/service/value/constant）同样也是单例模式，但相比Angular 2.x则有一些小小的缺陷。

最明显的就是，AngularJS 1.x中的单例模式永远是module范围内的，无法限制在某个controller或directive范围内。

因此，只要在某个module中注册了某个service，则在该module范围内均可用，且均唯一，无法在某个controller或directive范围内创建新的service实例。

## 扩展阅读：简单的单例模式实现

这里使用TypeScript来实现一个简单的单例模式类。

```typescript
// user.model.ts

// 这里定义一个使用单例模式的User类
// 其中name和age两个属性
export default class User {

  // 这个私有静态属性，专门用来存放唯一的类实例
  private static instance : User;

  name : string;
  age : number;

  // 这里将构造函数设为私有
  // 防止外部使用new关键字创建新的实例
  private constructor (name : string, age : number) {
    this.name = name;
    this.age = age;
  }

  // 静态方法getInstance专门用来获取类实例
  // 如果用来存放唯一实例的私有静态属性instance不存在
  // 则创建一个唯一的新实例
  // 否则返回已存在的唯一实例
  static getInstance () : User {
    if (typeof User.instance === 'undefined') {
      // 如果不存在已有的instance，则初始化一个新的instance
      User.instance = new User('User Instance', 18);
    }
    
    return User.instance;
  }

}
```

```typescript
// main.ts

import User from './user.model';

// 这里使用getInstance方法获取User类的实例
// 因此无论获取多少次，每次获取到的都是同样一个单例
const user1 = User.getInstance();
const user2 = User.getInstance();

console.log(user1.name); // User Instance
// 由于是同一个单例，因此user1和user2严格相等
console.log(user1 === user2); // true

// 这里我修改user1的name属性，user2的name属性同时也会发生变化
user1.name = 'Jim Green';

console.log(user1.name); // Jim Green
console.log(user2.name); // Jim Green
```
