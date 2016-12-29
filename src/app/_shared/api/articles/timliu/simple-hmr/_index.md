# 在 Angular-CLI 中启用 HMR

## 写作原因
关于 HMR 的功能，[Webpack wiki][] 上是这样介绍的：
> Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running without a page reload.

可以说，HMR 就是 “不重载”。
大家用 Angular-CLI 写代码的时候，每次保存，都会触发 live-reload，即代码重新编译（添删改模块），然后浏览器中页面自动重载（相当于按了一下 F5），整个过程大概 10 秒左右。
启用 HMR 后，这个“页面重载”的过程（大概每次 3 至 5 秒）就被节省下来了，即相比 live-reload 节省了大概一半的时间。
看似微不足道的时间节省，对某些如我的强迫症患者来说，真的是天上地下。

那么，该怎么在 Angular-CLI 在中启用 HMR 呢？本文将根据 [angularcli-hmr-example][] 来介绍 HMR 配置过程。

## 读者指引
- Angular-CLI 从 1.0.0-beta.22 (2016-12-02) 开始支持 HMR 开关，参见 [CHANGELOG.md](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md)。CLI 版本低的需要先升级。
- 本篇写作思路是简单搬运，没有分析，没有解释。大家可以将本文当成一篇“一句话技巧”，说一声“朕直道了”，而后自行根据 [angularcli-hmr-example][] 来操作。
- 非要看解释可以参考 [Webpack wiki][]。看不懂不影响使用（我是没看懂）。
- 如果在启用 HMR 之后，你并没有感觉时间变短，可能是因为你的电脑硬件太强大，重载页面不用思考。

## 搬运过程

### 拷贝参考代码
```
> git clone https://github.com/jschwarty/angularcli-hmr-example.git
```
后面用到的代码，都在这个 repo 里。
其实你也可以直接将这个 repo 当成 starter 来用。

### 安装 Angular-CLI、新建 app、添加依赖 @angularclass/hmr
```
> npm i -g angular-cli@latest
> ng new hmr-demo
> cd hmr-demo
> npm i -D @angularclass/hmr
```

### 添加、修改 environments 文件并在 angular-cli.json 里注册
在 `hmr-demo\src` 文件夹下：
- 新建 `environments\environment.dev-hmr.ts` 文件（文件名随意，在 angular-cli.json 里注册时一致即可），内容如下：
  ```
  export const environment = {
    production: false,
    hmr: true
  };
  ```
- 更改 `environments\environment.ts` 和  `environments\environment.prod.ts`，添加 `hmr: false`。
- 在 `angular-cli.json` 里注册 `environment.dev-hmr.ts`：
  ```json
  "environments": {
    "dev-hmr": "environments/environment.dev-hmr.ts",
  ```

### 添加 hmr.ts
新建 `hmr-demo\src\hmr.ts`，内容如下： 

```ts
import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();
  bootstrap().then(mod => ngModule = mod);
  module.hot.dispose(() => {
    let appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    let elements = appRef.components.map(c => c.location.nativeElement);
    let makeVisible = createNewHosts(elements);
    ngModule.destroy();
    makeVisible();
  });
};
```

### 重置 main.ts
重置 `hmr-demo\src\main.ts` 文件夹下，内容如下：

```ts
import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';
import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule);
};

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.info('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap();
}
```

### 添加新的 npm script
修改 `hmr-demo\package.json`，添加：  

```json
"scripts": {
  "hmr": "ng serve --hmr -e=dev-hmr"
```

### serve 起来
```
> npm run hmr
```
浏览器 console 里看到：`[HMR] Waiting for update signal from WDS...`、`[WDS] Hot Module Replacement enabled.`。   
修改 app 代码，比如在 `app.component.html` 里改个字符，保存。几秒过后，浏览器里看到页面变化（网页标签上没有出现“载入中”，即 “without a page reload”），同时 console 说：`[HMR] Updated modules: ...`。  
在 `updated modules`下面列出了7、8个项目，我们不是只改了一个 hmtl 吗？如果只 reload 一个 module 是不是会更快？该怎么做呢？再看看 [wiki][Webpack wiki]。  

### 修改 angular-cli blueprint
如果你不想每次 `ng new` 之后重复上面的工作，那么你需要修改 angular-cli 的 blueprint。具体步骤如下：  
- Fork [angular-cli](https://github.com/angular/angular-cli), 然后 clone 到本地。
- 按照“搬运过程”来修改文件，文件所在路径是 `packages/angular-cli/blueprints/ng2/files/__path__/`，比如 `main.ts` 在 `packages/angular-cli/blueprints/ng2/files/__path__/main.ts`。
- 然后 `npm link`，参考 [Development Hints for hacking on angular-cli](https://github.com/angular/angular-cli#development-hints-for-hacking-on-angular-cli)。
- `npm link` 之后，就可以 `ng new xyz` 了，生成的 xyz 自带 hmr。
- 如果需要跟随 angular-cli 更新，还要做（参考大炮的文章[《如何工程化开发大型angular2项目》](https://wx.angular.cn/library/article/%E5%A6%82%E4%BD%95%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%BC%80%E5%8F%91%E5%A4%A7%E5%9E%8Bangular2%E9%A1%B9%E7%9B%AE)）：  

  ```
  git remote add upstream https://github.com/angular/angular-cli
  git fetch upstream
  git merge upstream/master
  ```

如果你懒得去改 blueprint，你可以 clone 我改好的 [repo](https://github.com/rxjs-space/angular-cli)，当然也需要通过 `npm link` 来使用。


**Happy coding!**


[Webpack wiki]: https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack
[angularcli-hmr-example]: https://github.com/jschwarty/angularcli-hmr-example
