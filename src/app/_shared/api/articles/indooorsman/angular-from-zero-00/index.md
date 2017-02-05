# Angular 2从零开始系列 - 00

本系列将会从零开始构建一个完整的Angular应用，不依赖任何seed或starter，也不使用Angular cli，这样做的目的是让自己对Angular应用开发的每一个环节都有一定的了解。

最终的示例会包含以下特性：

- 采用webpack进行构建、编译、模块打包
- 模板采用pug编写
- 样式采用less编写
- 路由懒加载
- 通过npm script『一键』创建组件相关目录和文件
- 开发环境模块热替换(hot module replacement)
- 生产环境AoT编译

希望对大家有所帮助。

## 序章

### 基础知识

- NPM <https://www.npmjs.com>
- ES6 <http://es6.ruanyifeng.com>
- Webpack <https://webpack.js.org>
- Angular <https://angular.cn>

以上内容是我认为在开始动手之前必须要有一定了解的，不必精通，浏览一遍各自的文档，理解其核心概念即可。

那么这里为什么没有提`TypeScript`呢？因为根据我的实践经验，有`ES6`的基础的话，不必系统学习`TypeScript`，开发中遇到其特有的功能时进行针对性的查阅就行了

### 创建项目

#### 环境

我们采用npm来管理依赖，NodeJS运行环境当然是必不可少的，所以第一步就是安装NodeJS <https://nodejs.org/>

另外介于国内的网络环境，推荐使用淘宝的npm镜像：<https://npm.taobao.org/>，请按照网站上的说明进行配置

#### 初始化

- 打开终端：

```bash
mkdir angular-app
cd angular-app
npm init #可按照提示填写项目基本信息，或直接一路回车
```

- 安装依赖：

```bash
# Angular
npm install @angular/common @angular/compiler @angular/compiler-cli @angular/core @angular/forms @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/platform-server @angular/router rxjs zone.js --save

# Webpack
npm install webpack --save-dev

# Typescript
npm install typescript --save-dev
```

注意这些并不是最终全部的依赖，随着开发的进展，后面会陆续添加其他依赖

(未完待续...)

