# 从 Angluar-CLI 到 NPM

## 写作目的
使用 Angluar-CLI 写好了一个 module，需要重复使用，能不能发到 NPM 上去呢？
本文将用试错的方式来制作一个 `tl-ui` package（里面有一个 `tl-ui` module），然后发布到 NPM。（`tl-ui` 只是个随意起的名字。）

## 读者指引
- 本文所述方法是笔者通过试错摸索出来的，过程中大量参考了 [@ng-bootstrap/ng-bootstrap][]。
- 试错固然啰嗦，需要干货的同学请移步“总结”部分。
- 本文在测试安装本地 package 的过程中，没有使用 `npm link` -- 笔者试验多次均以 Error 告终。
- 阅读本文，需要读者简单了解以下知识点：
  - [`tsconfig.json` 的配置](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
  - [Angular-CLI 指令](https://github.com/angular/angular-cli)
  - [npm 指令](https://docs.npmjs.com/)

## 制作 tl-ui package (里面有个 tl-ui module)
敲指令：
```
npm i angular-cli -g
npm i typescript -g
ng new tl-ui // 这个是 package
cd tl-ui
ng g module tl-ui // 这个是 module
```
### 更改标签前缀设置
看一下 `src\app\tl-ui\tl-ui.component.ts`，selector 是 `app-tl-ui`，不想要那个 app 前缀？删掉不就行了？
selector 改成 `tl-ui`之后，tslint 又报错，“你得有 app 前缀啊”。可以这样：
- 修改 `angular-cli.json`：`"apps": [{ "prefix": "app"}]` => `"apps": [{ "prefix": ""}]`，这样 `ng g` 的时候就不会有自动前缀了。
- 修改 `tslint.json`：`directive/component-selector-prefix": [true, "app"]` => `directive/component-selector-prefix": [true, "app", "tl"]`，这样 tslint 就接受 tl 这个前缀了。

### serve 起来
然后，我们在 app.module 里使用 tl-component，看一下效果：

```ts
// `tl-ui\src\app\tl-ui\tl-ui.module.ts`
exports: [TlUiComponent]
// 'tl-ui\src\app\app.module.ts'
imports: [TlUiModule]
```
```html
<!-- `tl-ui\src\app\app.component.html` --> 
<tl-ui></tl-ui>
```
`ng serve`，看到 'tl-ui works'。真不容易, module 算是制作完毕了。别忘了 `git commit`，出岔子的时候好 roll back。

## 安装本地的 tl-ui package
要使用某个 npm package，我们无非就是 `npm i xyzPackage` ，而后 `import { a, b, c } from xyzPackage` 。
能不能也这样来使用本地的 `tl-ui` package 呢？

### 转移 dependencies
让我们先切换到另一个 project 里：
```
> cd .. // 退出 tl-ui folder
> ng new another-project
> cd another-project
> npm i ../tl-ui （别冲动，先不要敲回车）
```
在安装一个 package 的时候，npm 会根据 package.json 来获取相关依赖（dependencies 项目下的内容）。
我们要在 `another-project` 下面使用 `tl-ui` module，真的需要安装 `tl-ui\package.json` 里面 denpendencies 吗？
先看一下 `tl-ui.module.ts` 和 `tl-ui.component.ts`，我们用到的只有 `@angular/core` 和 `@angular/common`。
但凡是个 angular 2 project，就会有这两个依赖，所以，我们可以先这样：将 `tl-ui\package.json` 里的 dependencies 下的内容，全部转移到 devDependencies 下面，然后再安装。  

在 `another-project` 目录下运行 `npm i ../tl-ui`，10秒钟左右就安装好了。我们可以通过查看 `another-project\node_modules\tl-ui` 来验证。
至于能不能用，通过 import 来试试看吧。

```ts
// `another-project\src\app\app.module.ts
import { TlUiModule } from 'tl-ui/src/app/tl-ui/tl-ui.module';
@NgModule({imports: [TlUiModule]})
```
还真能找到 `TlUiModule`。注意 `from 'tl-ui/src/app/tl-ui/tl-ui.module'`，这里最前面的 `tl-ui`不再是目录名，而是 package 的名字，对应 `tl-ui\package.json` 里的 name。  

到底能不能用呢？（见证奇迹的时刻到了...）
```
> (at another-project) npm start （就是 ng serve）
```
然而，报错了：`Cannot find module 'tl-ui/src/app/tl-ui/tl-ui.module'`。
这是几个意思？搜索搜索，也没弄明白。这时我们可以去参考其他 angular 的第三方 package，比如 [@ng-bootstrap/ng-bootstrap][]。

### 创建根 index，并编译 ts 文件
如果我们安装了第三方库 @ng-bootstrap/ng-bootstrap，在 `another-project\node_modules\@ng-bootstrap\ng-bootstrap` 下，是怎样一番景象呢？
- 有 index.js，这样我们在 import 时，就不用写一长串的路径了；
- 每个 js 文件配备一个 d.ts 文件，这些是 js 文件对应的类型声明（declaration）文件。

为什么要 js + d.ts？这个我没深究，估计是 webpack 在使用 node_modules 时需要 js 文件，typescript 又需要对应的 d.ts 文件。
不管这些，我们来照葫芦画个瓢（创建 index.ts，并编译 ts 文件至 js + d.ts）：
- 在 `tl-ui` package 根目录下，新建 `index.ts`，添加一行：
  ```ts
  export { TlUiModule } from './src/app/tl-ui/tl-ui.module';
  ```
- 在 `tl-ui` package 根目录下，新建 `tsconfig.json`，添加几行（declaration 选项就是是否生成 d.ts 文件的开关）：
  ```json
  {
      "compilerOptions": {
          "module": "commonjs",
          "target": "es5",
          "noImplicitAny": false,
          "sourceMap": false,
          "declaration": true,
          "emitDecoratorMetadata": true,
          "experimentalDecorators": true,
          "lib": ["es6", "dom"]
      },
      "files": ["index.ts"]
  }
  ```
- 在 `tl-ui` package 根目录下，运行 `tsc -p tsconfig.json`。现在能看到 index.js 以及 tl-ui.module.js 等等，还有对应的 d.ts 文件。

### 编译 ts 文件后重新安装
重新安装试试看。
```
> (at another-project) npm i ../tl-ui
```
报错：
```
... Error: EPERM: operation not permitted, rename '...another-project\node_modules\tl-ui' -> '...another-project\node_modules\.tl-ui.DELETE'
... Please try running this command again as root/Administrator.
```
好吧，用 Administrator 打开 cmd，重新安装，顺利通过。（我是不是暴露身份了 -- 发现一个用 windows 的小白）
其实，我们也可以先运行 `npm uni tl-ui`，然后再安装，也可以通过。

### 将 html template 写在 component.ts 里
serve 起来看一下。（见证奇迹的时刻又到了...）
```
> (at another-project) npm start
```
又报错：`Error: ... Can't read the url "tl-ui.component.html"`。没有 webpack，没有 loader，那就把 html 写到 ts 里好了：

```ts
// tl-ui\tl-ui\tl-ui.component.ts
@Component({
  selector: 'tl-ui',
  template: `<p>tl-ui works!</p>`,
  styles: []
})
```
重新编译，`tsc -p tsconfig.json`；重新安装，`npm i ../tl-ui`（Administator 也会报错，重装两遍通过）；（双到了见证奇迹的时刻）serve 起来，`npm start`。  

奇 迹 终 于 出 现 了 -- `tl-ui works!`。

## 发布 tl-ui package 至 npm，并从 npm 安装
发布很简单，`npm publish` 就好，刚才我们每次更改 package 以后都要编译，可以把编译工作放到 npm script 里：

```json
// tl-ui\package.json
"scripts": { "prepublish": "tsc -p tsconfig.json" },
```
然后，`npm publish`。报错：`This package has been marked as private`。
改 `package.json`，`"private": false`；重新 publish。报错：`auth required for publishing`。额，还没注册用户...
根据提示运行 `npm adduser`，添加用户名、密码、email，登上了。重新 publish。
`+ tl-ui@0.0.0`，一个加号，几个意思？先 `npm show` 一下：
```
> npm show tl-ui time
{ modified: '2016-12-20T15:35:57.084Z',
  created: '2016-12-20T15:35:57.084Z',
  '0.0.0': '2016-12-20T15:35:57.084Z' }
```
好像有戏。我们回到 another-project，卸载之前安装的 tl-ui，然后，（见证奇迹的时刻叒到了）：
```
> (at another-project) npm uni tl-ui
> npm i tl-ui -S
```
安 装 成 功！serve 起来，`npm start`，看到`tl-ui works!`。It works!   

别着急庆祝，我们看看，如果在 another-project 里不删除 tl-ui，重新发布 tl-ui 以后，安装时是否报错。
首先，更改 `tl-ui` package，随便改，template 里加两个叹号吧；然后发布；
报错，版本号没改；来到 `package.json`，改 `  "version": "0.0.1",`；重新发布，通过；
然后新开一个 cmd 窗口，不用 Administrator 身份，来到 `another-project` 目录，不卸载 `tl-ui`，运行 `npm i tl-ui`，通过；
`npm start`，`tl-ui works!!!`。

## 给我们的 package 在 github 上安个家
将 `tl-ui` package **push** 到 github 上。另外，考虑在 package 里加上 examples（README.md 不够生动），告诉别人如何使用 `tl-ui` module（我们的 app.module 其实就是 examples）。
然后运行 `ng github-pages:deploy`，之后就可以通过 `https://user.github.io/package-name` 来访问 examples了。

## 这才只是个开始
拿 `tl-ui\package.json` 跟 [@ng-bootstrap/ng-bootstrap][] 的比较一下，就知道，这才只是个开始，做成一个 npm package ... 的路还很长。翻滚翻滚...

## 总结
要把 Angular-CLI 做好的 module 发到 NPM 上，需要（步骤很多，但都很简单）：
- `ng new package awesome-package`
- `ng g module awesome-module`
- 为了标签前缀，稍微修改 `angular-cli.json` 和 `tslint.json`
- 完成 awesome-module 的开发（template 和 styles 直接写在 component 里）
- 根目录新建 `index.ts`，并 re-export `awesome-module`
- 根目录新建 `tsconfig.json`，设置 declaration 为 true
- 在 `package.json` 里：
  - 转移 dependencies 至 devDependencies （也许要保留一些在 dependencies，也许要添加 peerDependencies）
  - 将 private 改为 false
  - 添加 script: `"prepublish": "tsc -p tsconfig.json"`
  - 设定版本号
- 在本地测试安装，先运行 `npm run prepublish`（就是 tsc），再移步其他 project ，以相对路径来安装
- 通过本地测试以后，运行 `npm adduser`，`npm publish`
- 别忘了 `git commit`、`git push`
- 现在可以 `npm i awesome-package`了，然后 `import { awsome-module } from 'awesome-package'`。
- 制作 examples，然后 `ng github-pages:deploy`，让大家看看 awesome package 的使用效果。
- 不是最后的最后，按照 npm docs 的说法，我们还需要：Brag about it. Send emails, write blogs, blab in IRC. Tell the world how easy it is to install your program! 比如这样：
  > [tl-ui](https://rxjs-space.github.io/tl-ui/) -- UI components made easy.

## 参考
- [@ng-bootstrap/ng-bootstrap][]
- [NPM Developer Guide](https://docs.npmjs.com/misc/developers)

[@ng-bootstrap/ng-bootstrap]: https://github.com/ng-bootstrap/ng-bootstrap