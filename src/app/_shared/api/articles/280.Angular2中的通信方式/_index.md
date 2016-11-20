# Angular 2 中的通信方式

软件工程中，随着应用规模的不断扩大，必然需要进行 Code Splitting。在 Web 开发中，组件化和模块化的观念已经被越来越多的人所熟知，从而编写出更高质量的代码。

同时，随着实体职责的分离，我们也就会不可避免地需要进行实体间的相互通信，因为我们的应用仍然需要作为一个整体存在。因此，在本文中，将对 Angular 2 中的实体间通信方式进行简要介绍，以帮助读者编写更易于维护的代码。

## 术语表

+ 输入/Input：组件中的外部输入，通常由 [@Input()](https://angular.io/docs/ts/latest/api/core/index/Input-interface.html) 属性装饰器或 [@Component()](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html) 类装饰器参数中的 inputs 属性指定。
+ 数据/Data（Datum）：信息本身或其直接载体，后者通常为基本类型或其他直接携带信息的实体类型的实例。*为可数名词，通常使用其复数形式。*
+ 材料/Material：所有由 Provider 所产生的具体内容，如通过 useClass 注册并生成的 Service 的实例等。
+ 提供商/Provider：用于产生某种 Material 的实体。使用 useClass 时，Provider 通常为 Material 的类；使用 useFactory 时，Provider 通常为返回 Material 的函数；使用 useValue 时，Provider 通常为 Material 本身。其中，通过 useClass 方式注册的 Provider 通常使用 [@Injectable()](https://angular.io/docs/ts/latest/api/core/index/Injectable-decorator.html) 装饰器修饰。

## 通信方式介绍

下面列出一些常用的通信方式并进行简要说明。

### 输入：数据

+ 通信源：父组件与子组件
+ 数据方向：父组件 => 子组件
+ 信号方向：父组件 => 子组件

数据输入是最为常用的通信方式，对于父组件与子组件／指令而言，由子指令配置所需的输入项，默认为必须，可由 [@Optional()](https://angular.io/docs/ts/latest/api/core/index/Optional-decorator.html) 装饰器配置为可选。同时在父组件模版中使用属性绑定语法（使用 [prop]="expression" 绑定到表达式或 prop="literal" 绑定到字面值）指定绑定源。随后，于子组件／指令的构造函数与 [OnInit](https://angular.io/docs/ts/latest/api/core/index/OnInit-class.html) 生命周期之间，子组件／指令的输入属性绑定完成。每当绑定源发生变化时，子组件／指令的输入属性也会发生对应变化。例如：

```typescript
@Component({
  template: `
    <child [propOne]="1 + 1" propTwo="1 + 1"></child>
  `
})
class Parent { }

@Component({
  selector: 'child'
})
class Child implements OnInit {
  @Input() propOne: number
  @Input() propTwo: string
  
  ngOnInit(): void {
    console.log(this.propOne) // 2
    console.log(this.propTwo) // "1 + 1"
  }
}

@Directive({
  selector: '[propOne][propTwo]'
})
class Spy implements OnInit {
  @Input() propOne: number
  @Input() propTwo: string
  
  ngOnInit(): void {
    console.log(this.propOne) // 2
    console.log(this.propTwo) // "1 + 1"
  }
}
```

这里可以看到，每个组件／指令都可以定义自己所需的输入，对于同宿主的若干个指令（或一个组件和若干指令，同一个宿主不可以出现多个组件）如果有同名的输入会被共享。

另外，ng2 中的输入（属性绑定）在某种意义上来说是 "强类型" 的，拥有严格的检查机制，如果使用了一个不存在的输入会被视为语法错误（如果同时使用了原生的 [CustomElements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) 或其他库来扩展 HTML 则需要在模块定义中注册自定义扩展语法）。

同时，在默认的变化监测策略中并且没有主动调用 changeDetector 的相关状态修改方法时，输入是动态绑定的，即一旦数据源发生变化就会对目标组件／指令的对应属性重新赋值。

通过自 ES6 引入的 [Getter](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/get)／[Setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 语法（ES5 中 [Object#defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 的语法糖），我们可以很方便地在每次输入变化时得到通知：

```typescript
@Component({
  selector: 'child'
})
class Child implements OnInit {
  @Input() set propOne(value: number) {
    console.log(`Property one changed to ${value}`)
  }
  
  // ...
}
```

但是我们这里发现了一个问题，如果输入属性的值没有变化的话，我们又想要通知到目标（子）组件／指令，那要怎么办呢？事实上，由于 Angular 2 采用脏检测的机制，我们并没有办法直接应用一个 "变化后的值与变化前相同" 的变化。诚然，我们可以对绑定的数据进行一层封装，然后绑定封装对象，但有一些时候，我们并不想传递什么数据，只是需要单纯地传递一个信号，即一个 Void Input，这时候，除了使用封装对象，我们还可以有另一些方式供选择。


### 输入：事件

+ 通信源：父组件与子组件
+ 数据方向：父组件 => 子组件（可空）
+ 信号方向：父组件 => 子组件

我们已经知道（后文中也会提到），输出属性（事件绑定）使用了 [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) 这个事件流来实现下级到上级的信号传递。和输入属性不同，输出属性的 "变化" 不依赖于脏检测，而是基于主动的事件通知。

事实上，对输入属性，我们也同样可以使用事件流来绑定我们传递输入内容：

```typescript
@Component({
  selector: 'child'
})
class Child implements OnInit, OnDestroy {
  @Input() set propOne(value: Observable<number>) {
    if (this.propOneSubscription) {
      this.propOneSubscription.unsubscribe()
    }
    
    this.propOneSubscription = value.subscribe(/* Some Logic */)
    // Or use AsyncPipe in template
  }
  
  private propOneSubscription: Subscription<number>
  
  ngOnDestroy(): void {
    this.propOneSubscription.unsubscribe()
  }
  
  //...
}
```

当然，由于不像输出属性那样由 ng 自动管理，因此我们需要自行管理订阅，以免产生内存泄漏。

这样，我们可以实现不需要对应数据的（父组件到子组件的）纯事件传递。

相比于直接的数据输入而言，事件流输入更有利于对组件内部状态的控制。


### 实例访问：向下

+ 通信源：父组件与子组件
+ 数据方向：父组件 <=> 子组件（可任意方向或双向同时）
+ 信号方向：父组件 => 子组件

输入属性的一个优势是低耦合性，父组件无需知晓子组件／指令的类型信息，只需要已经子组件的一个或几个输入项即可。

但是有些时候，当组件／指令间有明确的固定关系，并且我们需要细粒度操作的时候，我们也可以选择提升耦合性来简化通信过程。

ng1 中，我们可以在 [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile#directive-definition-object) 中指定 `require` 属性来获取同宿主或父指令（的控制器）的实例。而在 ng2 中我们还可以获取子组件的实例，并且配置更为简单，只需要借助 [@ViewChild()](https://angular.io/docs/ts/latest/api/core/index/ViewChild-decorator.html)／[@ViewChildren()](https://angular.io/docs/ts/latest/api/core/index/ViewChildren-decorator.html) 或 [@ContentChild()](https://angular.io/docs/ts/latest/api/core/index/ContentChild-decorator.html)／[@ContentChildren()](https://angular.io/docs/ts/latest/api/core/index/ContentChildren-decorator.html) 声明属性即可：

```typescript
@Component({
  template: `
    <child></child>
  `
})
class Parent implements AfterViewInit {
  @ViewChild(Child) child: Child

  ngAfterViewInit(): void {
    const someChildProp = this.child.someProp
    const result = this.child.someMethod('abc')
  }
}

@Component({
  selector: 'child'
})
class Child implements OnInit {  
  someProp: number
  
  someMethod(input: string): string {
    return `${input} operated by child`
  }
}
```

上面的代码中，我们在父组件中获取到了子组件的实例，并且直接访问子组件的公开属性和方法（TypeScript 不加可访问性修饰符即默认为 public）。之所以需要在 [AfterViewInit](https://angular.io/docs/ts/latest/api/core/index/AfterViewInit-class.html) 这个生命周期后才能操作，是由于父组件的初始化过程在子组件之前，因此在父组件的构造函数或 OnInit 阶段子组件还未实例化，当然也就无从获取。

这样可以较为方便的实现复杂操作，例如同时输入或输出多项数据（如果使用多个输出属性会很 Tricky，因为事件响应相互独立），还能够进行实时反馈（即双向数据传输）。

一个常见的例子是我们基于 [NgModel](https://angular.io/docs/ts/latest/api/forms/index/NgModel-directive.html) 封装自己的输入控件，其中往往会需要对 NgModel 的 API 进行细粒度操作。对于这样的复杂操作而言，基于数据绑定和事件绑定会让代码过于复杂，工程上几乎不可行。

### 实例访问：向上

+ 通信源：父组件与子组件／同宿主组件与指令
+ 数据方向：父组件 <=> 子组件／任一组件或指令  <=> 任一组件或指令
+ 信号方向：父组件 <= 子组件／任一组件或指令（使用依赖方） => 任一组件或指令（作为依赖方）

同样的，我们也能够从子组件／指令获取父组件或同宿主组件／指令的实例，具体的方式对于大家来说既熟悉又陌生，那就是依赖注入：

```typescript
@Component({
  template: `
    <child></child>
    <child></child>
    <child></child>
  `
})
class Parent implements AfterViewInit {
  children: Child[] = []

  register(child: Child) {
    this.children.push(child)
  }
}

@Component({
  selector: 'child'
})
class Child implements OnInit {  
  constructor(private parent: Parent) {}
  
  ngOnInit(): void {
    this.parent.register(this)
  }
}
```

上面的代码中，我们在子组件的构造函数中注入了父组件的实例，如果有需要我们还可以通过 [@Self()](https://angular.io/docs/ts/latest/api/core/index/Self-decorator.html)，[@SkipSelf()](https://angular.io/docs/ts/latest/api/core/index/SkipSelf-decorator.html)  和 [@Host()](https://angular.io/docs/ts/latest/api/core/index/Host-decorator.html) 来限制该实例的来源，比 ng1 中的 `^` 符号组合显然清晰的多。

由于子组件／指令构造时父组件早已构造完成，因此可以无需等待直接获取到父组件的实例。

这里我们使用了一个子组件自行向父组件登记自身存在的例子，相比于父组件一次性获取所有子组件实例，这样的优势是能够动态增删子组件列表。一个应用实例就是 [NgForm](https://angular.io/docs/ts/latest/api/forms/index/NgForm-directive.html) 与 [NgControl](https://angular.io/docs/ts/latest/api/forms/index/NgControl-class.html) 之间的交互，由于表单可能在使用过程中动态变化，所以无法在表单初始化时一次性获取所有控件实例，而需要支持使用中动态注册与注销控件的功能。


### 实例访问：服务

+ 通信源：组件与服务
+ 数据方向：组件 <=> 服务
+ 信号方向：组件 <=> 服务

事实上，实例操纵这种方式我们一直都在使用，例如组件对服务的访问：

```typescript
@Component({
  template: `
    <p>Whatever</p>
  `
})
class SomeComponent implements OnInit {
  constructor(private someService: SomeService) { }
  
  ngOnInit(): void {
    this.someService.someMethod()
  }
}

@Injectable()
class SomeService {  
  someMethod(): void { }
}
```

上面的代码中，我们使用 [@Injectable()](https://angular.io/docs/ts/latest/api/core/index/Injectable-decorator.html) 来修饰我们的服务。不过事实上，@Injectable() 并不是指可以被注入到别的内容中，而是指别的内容可以被注入进来，由于我们这里 SomeService 并不依赖于其他内容，故完全可以不使用 @Injectable()。但为了代码一致性，对全体服务都使用 @Injectable() 装饰能够让代码更加清晰。

此外，服务也一样能够配合 Observable 使用，例如 [Location](https://angular.io/docs/ts/latest/api/common/index/Location-class.html) 和 [ActivatedRoute](https://angular.io/docs/ts/latest/api/router/index/ActivatedRoute-interface.html) 就提供了持续的事件流，因此也能够实现服务到组件的信号传递。


### 输出：事件

+ 通信源：父组件与子组件
+ 数据方向：父组件 <= 子组件（可空）
+ 信号方向：父组件 <= 子组件

与输入属性相对应，每个组件／指令都可以通过 [@Output](https://angular.io/docs/ts/latest/api/core/index/Output-interface.html) 来指定输出属性，每个输出属性都是 [EventEmitter](https://angular.io/docs/ts/latest/api/core/index/EventEmitter-class.html) 的一个实例，前者继承自 Reactive Extensions 中的 [Subject](http://reactivex.io/rxjs/class/es6/Subject.js~Subject.html)。

```typescript
@Component({
  template: `
    <child (output)="onOutput($event)"></child>
  `
})
class Parent {
  onOutput(event: number): void {
    console.log(event)
  }
}

@Component({
  selector: 'child'
})
class Child implements OnInit {  
  @Output() output = new EventEmitter<number>()
  
  onInit(): void {
    this.output.emit(123)
  }
}
```

由于这里的 Subject 由 ng 进行管理，我们无需关心 subscribe 和 unsubscribe 的调用，只需要简单应对事件侦听即可。


### 提供商：单值

+ 通信源：父组件与子组件
+ 数据方向：父组件 => 子组件
+ 信号方向：父组件 => 子组件

归功于 ng2 引入的 [Hierarchical Injector](https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html) 机制，每个组件／指令都可以有独立（并继承）的 Injector。相比于 ng1 中的全局唯一的 Injector 而言，在 ng2 中我们可以对提供商进行细粒度控制。

我们可以使用 @Optional 的依赖来进行数据传递（或者在模块／根组件中提供默认内容）：

```typescript
@Component({
  template: `
    <child></child>
  `,
  providers: [
    { provide: 'someToken', useValue: 123 }
  ]
})
class Parent { }

@Component({
  selector: 'child'
})
class Child implements OnInit {  
  constructor(@Inject('someToken') private someProp: number) { }
}
```

通过提供商（默认为单值）进行通信的一个特点是静态性，即所需传输的内容一经确定就不可再更改（我们这里使用了 useValue 提供常量，实际上还能通过 useFactory 即时生成内容），并且具有明确的层次性，上层能够对所有下层提供数据，并且中间层能够覆盖上层内容。

一个很常见的例子就是用于制作开关（或其他辅助标识），或者应用策略模式。


### 提供商：多值

+ 通信源：同宿主组件与指令
+ 数据方向：任一组件／指令 <= 若干组件／指令
+ 信号方向：任一组件／指令 => 若干组件／指令

上面我们已经知道了 @ViewChildren() ，可以一次性获取到全体某个类型的子组件／指令列表。同时也知道了依赖注入可以得到同宿主的组件／指令实例。

但还有一个场景解决不了，就是我们需要得到同宿主的多个同 "类型" 的全体指令。（当然，这里的类型并不是真的 JavaScript 类型，因为一个指令在一个元素上至多只会被应用一次，可以理解为相同标识）

在 ng2 中，有一个黑魔法可以解决这个问题，就是设置了 `multi: true` 的提供商，这类提供商可以被多次注册，并且不会被覆盖，而是会进行汇总：

```typescript
@Component({
  template: `
    <p>Whatever</p>
  `
})
class SomeComponent {
  constructor(@Inject('magicNumber') tokens: number[]) {
    console.log(tokens) // [1, 2]
  }
}

@Directive({
  selector: '[propOne]',
  providers: [
    { provide: 'magicNumber', useValue: 1, multi: true }
  ]
})
class DirectiveOne { }

@Directive({
  selector: '[propTwo]',
  providers: [
    { provide: 'magicNumber', useValue: 2, multi: true }
  ]
})
class DirectiveTwo { }
```

这样，通过某个共同的 Token，每个组件／指令都可以得到其他组件／指令给出的材料，而无需知晓其他组件／指令的具体存在。

一个应用实例是 [FormControlName](https://angular.io/docs/ts/latest/api/forms/index/FormControlName-directive.html) 与 [Validator](https://angular.io/docs/ts/latest/api/forms/index/NG_VALIDATORS-let.html) 及 [AsyncValidator](https://angular.io/docs/ts/latest/api/forms/index/NG_ASYNC_VALIDATORS-let.html) 之间的交互，所有 Validator 指令都直接应用在 FromControl 所在的元素上，而 FormControl 无需知道每个 Validator 指令的具体形式（无论是内置的还是自定义的），只需要收集每个 Validator 指令所提供的验证函数即可。

当然，这并不是 `multi: true` 的唯一作用，比如我们还能通过 [APP_BOOTSTRAP_LISTENER](https://angular.io/docs/ts/latest/api/core/index/APP_BOOTSTRAP_LISTENER-let.html) 来监听应用的启动等等。


## 速查表

说了这么多，那么我们在应用中应该如何选择这些通信方式呢？这里提供了简单的决策树，以帮助读者快速进行查阅。（仅仅提供参考，并不一定是具体场景下最优选择，实际项目请以自身实际情况为准）

```text
1.是否为组件／指令间通信？
|
|- T
|  |- 2. 是否有位置关系？
|     |
|     |- T
|     |  |- 3. 是否有明确的行为关联（固定搭配）？
|     |     |
|     |     |- T
|     |     |  |- 4. 是否具有固定的上下级关系
|     |     |     |
|     |     |     |- T
|     |     |     |  |- 5. 是否仅需由上至下提供不可变内容？
|     |     |     |     |
|     |     |     |     |- T
|     |     |     |     |  |- (提供商：单值)
|     |     |     |     |
|     |     |     |     |- F
|     |     |     |        |- 6. 子组件／指令是否会动态变化？
|     |     |     |           |
|     |     |     |           |- T
|     |     |     |           |  |- (实例访问：向上)
|     |     |     |           |
|     |     |     |           |- F
|     |     |     |              |- (实例访问：向下）
|     |     |     |- F
|     |     |        |- 7. 是否明确处于同一宿主内？
|     |     |           |
|     |     |           |- T
|     |     |           |  |- 8. 是否有多个组件／指令同时作为数据源？
|     |     |           |     |
|     |     |           |     |- T
|     |     |           |     |  |- 9. 是否仅需提供不可变内容？
|     |     |           |     |     |
|     |     |           |     |     |- T
|     |     |           |     |     |  |- (提供商：多值)
|     |     |           |     |     |
|     |     |           |     |     |- F
|     |     |           |     |        |- (/*借助父组件／指令通信*/)
|     |     |           |     |- F
|     |     |           |        |- 10. 是否仅需提供不可变内容？
|     |     |           |           |
|     |     |           |           |- T
|     |     |           |           |  |- (提供商：单值)
|     |     |           |           |
|     |     |           |           |- F
|     |     |           |              |- (实例访问：向上)
|     |     |           |- F
|     |     |              |- 11. 是否明确为兄弟关系？
|     |     |                 |- T
|     |     |                 |  |- (/*借助父组件／指令通信*/)
|     |     |                 |
|     |     |                 |- F
|     |     |                    |- 那还叫什么固定搭配！
|     |     |- F
|     |        |- 12. 方向是否为由父向子？
|     |           |
|     |           |- T
|     |           |  |- 13. 输入是否影响自身以外的其他子组件内部状态？
|     |           |     |
|     |           |     |- T
|     |           |     |  |- (输入：事件)
|     |           |     |
|     |           |     |- F
|     |           |        |- (输入：数据)
|     |           |- F
|     |              |- 方向是否为由子向父？
|     |                 |
|     |                 |- T
|     |                 |  |- (输出：事件)
|     |                 |
|     |                 |- F
|     |                    |- (/*借助父组件／指令通信*/)
|     |- F
|        |- (/*借助服务通信*/)
|
|- F
   |- 是否为组件与服务间通信
      |- T
      |  |- (实例访问：服务)
      |
      |- F
         |- 并不确定你要做什么～
```


## 总结

1. ng2 应用结构基于组件树；
2. 组件／指令相互之间，组件／指令与服务之间需要相互通信；
3. 通信方式有很多种，选择合适的通信方式对应用实现会有很大帮助。
