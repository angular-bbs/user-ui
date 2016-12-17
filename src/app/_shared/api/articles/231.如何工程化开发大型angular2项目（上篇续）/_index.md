# 如何工程化开发大型angular2项目（上篇续）
## 项目目录管理
说到一个大的项目，随着项目越做越大。会发现目录越来越多，层级越来越深。万一哪天临时来的新同事梳理目录，够他喝一壶的了。不仅梳理困难，而且平时debug，也是够呛
我在devtool里找我想要调试的脚本，简直是‘翻衣倒柜’。就这些花的功夫够写好几行代码了。

目录管理算不上啥技术活，但是管理不甚，真的会浪费大量时间效率，导致产能低下。凡是要花你超过3分钟的事情，一定要留个心眼。要不为什么说日本一些大型工程做得好，主要他们流程细节讲究精确。

不扯这么多，其实每个团队都会有属于适合自己的一套规则规范，别人不一定适合你，你的不一定适合别人的。我简略说说我们在协同协作的一些约定吧。
在根目录无外乎：包依赖配置文件、代码缩进、css代码风格、ts代码风格等等一些配置文件，虽然有些零碎，但很大程度上自动得去维护我们项目一些基础规范。
当然包括代码规范的README.MD.下面简单罗列下：
```bash
├── dist  //打包输出目录
├── .editorconfig   //这个大家应该熟悉吧，具体可以访问 http://editorconfig.org
├── .gitignore
├── gulpfile.ts
├── .jshintrc
├── karma.conf.js
├── node_modules
├── package.json
├── protractor.conf.js
├── README.md
├── src   // 项目主入口
├── .stylelintrc
├── tools // 共用工具类，里面主要管理gulp不同任务脚本，以及依赖的一些第三方库管理，还包括自己写一些.d.ts声明文件
├── tsconfig.json
├── tslint.json
├── yarn.lock
├── 代码规范V2
└── 测试修改方法.MD

```
看完上面罗列的只是一级目录（ps：大家可以自己用tree -L 1等命令，查看自己的项目目录结构），其中一些大家都是可以通用的。
其实最核心还是我们主程序这一块，我们首先按照业务来划分譬如主页、登录、关于，进一步针对面向不同角色用户的划分会员、员工、管理。如果和角色关联性再进一步把业务抽象化划分：商品、门店等等抽象化概念。当然具体到某一功能时我们依据代码模式去
划分：例如数据模型、资源层、组件层等等。其实这些划分标准应该是自己团队同一讨论协商出来的，而且不是死的，阶段性去调整。当然大家要同一去执行，不然真的是如同虚设。

下面跟着我的逻辑来简单看看目录的划分：
```bash
└── client
    ├── app
    ├── assets
    ├── css
    ├── favicon.ico
    ├── index.html

```
这里划分很简单，前端客户端目录存放资源目录，样式管理目录，业务应用目录。就不做详述了。
```bash
├── app
│   ├── about
│   ├── app.component.e2e-spec.ts
│   ├── app.component.html
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app.resolver.ts
│   ├── app.routes.ts
│   ├── home
│   ├── login
│   ├── main
│   ├── main-prod.ts
│   ├── main.ts
│   ├── rxjs-extensions.ts
│   ├── shared
│   ├── system-config.ts
│  

```
app.component作为组件树，首当其冲放在应用根目录下。项目里默认在app.component放置路由插座，也包括一些
