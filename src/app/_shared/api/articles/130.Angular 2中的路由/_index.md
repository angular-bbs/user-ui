# Angular 2中的路由

## 什么是路由？

大多数Web应用都会需要路由，无论它是前端程序还是后端程序。那么你有没有深入思考过什么是“路由”？

“路由”实际上使用的是并列式构词法，在古汉语中，“路”和“由”是意义相近的。如果用通俗的方式解释“路由”，那就是“要去某地时所需经由的路径”。

套用到编程领域，用户想要去的地方，就是某个页面。光说“某个”页面是不行的，我们得先给它分配一个唯一的标识，而这个标识就是URL，Web的基础设施之一。

而路由就是根据指定的URL来为用户渲染页面的一种方式。

## 如何实现路由？

路由的实现原理其实说起来很简单的：

1. 拿到当前页面的URL
1. 把它解析成URL对象：路径（path）、查询参数（query）、片段（fragment）等
1. 根据这些URL对象，去路由表（Routes）中查找对应的路由定义（Route）
1. 找到路由定义后，根据路由定义中记载的东西渲染相应的页面，比如在Angular 2中它通常是由路由定义中的component属性来指定的

原理上简单未必实现上也简单，因为要处理的细节特别多。事实上，Angular 2路由的开发过程可谓是最曲折的，这从随Angular 2发行的router模块是3.0就可以看出来（其它模块都是2.0）。不过这些波折还是值得的，Angular 2 Final版的路由是目前我见过的最强大的前端路由体系。

## Angular 2路由简介

过去的中间版本就不去说了，有兴趣的可以自己去研究它的演化。我们这里只简单介绍一下Angular 2 Final的路由。

在API中，完整的路由定义对象是这样的：

- `path`是一个用作路由匹配规则DSL的字符串。
- `pathMatch`是一个用来指定匹配策略的字符串，比如完全匹配还是部分匹配。
- `component`是要渲染出的组件类。
- `redirectTo`是一个重定向指令，用来指定跳转到的地址。
- `outlet`用在多视图路由中，它用来指定当前路由组件要渲染到的位置。
- `canActivate`是一个数组，Angular会在激活某个路由前，先调用该数组中的这些服务，任何一个返回否，就会禁止进入该路由。
- `canActivateChild`跟`canActivate`类似，但是作用于当前路由的各级子路由。
- `canDeactivate`跟`canActivate`相反，`canActivate`是用来判断是否可以进入该路由的，而`canDeactivate`是判断是否可以从当前路由离开，比如当用户修改了却还没有保存时，就可以通过它阻止离开。
- `data`是为组件提供的附加数据，组件中可以通过`ActivatedRoute`服务来取得它。
- `resolve`和Angular 1中路由的resolve机制类似，也是用于为组件提供动态服务的。
- `children`是当前路由的子路由的数组。
- `loadChildren`则用来支持延迟加载（LazyLoad）子模块。

仅仅从这些定义中我们就可以看出几点：

1. 路由是以组件为中心的。不像Angular 1中需要同时制定模板和控制器，在Angular 2中，你直接指定组件类就可以了。
1. 它支持多视图。在同一个页面中可以同时存在多个渲染位和多个路由。
1. 它强化了生命周期控制。Angular 1中的生命周期控制相对比较麻烦一些，而Angular 2中则提供了非常完备的控制力。
1. 它是递归的。路由下面可以任意嵌套子路由。
1. 它支持延迟加载，以减小首次下载量。

## 典型的Angular路由

最后我们来看一个实例 —— 来自Angular官方教程的路由，我加了一些注释辅助大家理解。
```typescript
// 路由表，其中每一项都是一个路由定义
const appRoutes: Routes = [
  {
    // 匹配上''的
    path: '',
    // 就跳转到/dashboard
    redirectTo: '/dashboard',
    // 但采用完全匹配策略，否则所有路径都会先匹配上这一个，其它路由就无效了
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    // 指定要渲染出来的组件
    component: DashboardComponent
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  },
  {
    path: 'heroes',
    component: HeroesComponent
  }
];

// 导出给所属模块，供其加入自己的`imports`数组中。
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
```

```typescript
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // 从路由定义文件中导入后加入自己的`imports`数组就可以生效了。
    routing
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroDetailComponent,
    HeroesComponent
  ],
  providers: [
    HeroService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
```
