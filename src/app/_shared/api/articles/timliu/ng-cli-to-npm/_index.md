# 从 Angluar-CLI 到 NPM

## 写作目的
使用 Angluar-CLI 写好了一个 module，该怎么发布到 NPM 呢？我们使用试错的方式来尝试制作一个 `tl-ui` package（里面有一个 `tl-ui` module），然后发布到 NPM。

## 读者指引
本文所述方法是笔者通过试错摸索出来的，过程中大量参考了 [ng-bootstrap][]。

## 制作 tl-ui package (里面有个 tl-ui module)
敲指令：
```
npm i angular-cli -g
npm i typescript -g
ng new tl-ui // 这个是 package
cd tl-ui
ng g module tl-ui // 这个是 module
```
看一下 `src\app\tl-ui\tl-ui.component.ts`，selector 是 `app-tl-ui`，不想要那个 app 前缀？删掉不就行了？selector 改成了 `tl-ui`，tslint 又报错，“你得有 app 前缀啊”。可以这样：
- 修改 `angular-cli.json`：`"apps": [{ "prefix": "app"}]` => `"apps": [{ "prefix": ""}]`，这样 `ng g` 的时候就不会有前缀了。
- 修改 `tslint.json`：`directive/component-selector-prefix": [true, "app"]` => `directive/component-selector-prefix": [true, "app", "tl"]`，这样 tslint 就不会报错了。

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
`ng serve`，看到 'tl-ui works'。真不容易, module 制作完毕。别忘了 `git commit` 一下，方便后面出岔子之后 roll back。

## 在其他 project 里安装 tl-ui package
（本文没有使用 `npm link`，因为笔者试验多次都以 Error 告终。）
要使用一个 npm package，我们无非就是 `npm i xyzPackage` 一下，然后 `import { a, b, c } from xyzPackage` 就行了。这个 `tl-ui` package 能不能也这样来用呢？我们先切换到另一个 project 里：
```
> cd .. // 退出 tl-ui folder
> ng new another-project
> cd another-project
> npm i ../tl-ui （别冲动，先不要敲回车）
```
npm 安装一个 package 的时候，会根据 package.json 来获取相关依赖（dependencies 项目下的内容）。我们要在 `another-project` 下面使用 `tl-ui` module，真的需要安装 `tl-ui\package.json` 里面 denpendencies 吗？我们先看一下 `tl-ui.module.ts` 和 `tl-ui.component.ts`，我们用到的只有 `@angular/core` 和 `@angular/common`，只要是个 angular 2 project，就已经有这两个依赖了，所以，我们可以先这样：将 `tl-ui\package.json` 里的 dependencies 下的内容，全部转移到 devDependencies 下面。然后再在 `another-project` 目录下 `npm i ../tl-ui`。  

10秒钟左右，已经安装好了。我们可以通过查看 `another-project\node_modules\tl-ui` 来验证。至于能不能用，我们 import 一下试试看吧。

```ts
// `another-project\src\app\app.module.ts
import { TlUiModule } from 'tl-ui/src/app/tl-ui/tl-ui.module';
@ngModule({imports: [TlUiModule]})
```
还真能找到 `TlUiModule`。注意 `from 'tl-ui/src/app/tl-ui/tl-ui.module'`，这里最前面的 `tl-ui`不再是目录名，而是 package 的名字，在 `tl-ui\package.json` 里写下的名字。  

到底能不能用呢？
```
> (at another-project) npm start
```
然后，报错了：`Cannot find module 'tl-ui/src/app/tl-ui/tl-ui.module'`。这是几个意思？搜索搜索，也也没弄明白。这时我们可以去参考其他 angular 的第三方 package，比如 [ng-bootstrap][]。如果我们安装了 ng-bootstrap，在 `node_modules\@ng-bootstrap\ng-bootstrap` 下，是怎样一番景象呢？
- 有 index；
- 每个 js 文件配备一个 d.ts 文件。



- adds index.ts
- moves deps to devDeps
- tsc
- npm i ../tl-ui



[ng-bootstrap]: https://github.com/ng-bootstrap/ng-bootstrap