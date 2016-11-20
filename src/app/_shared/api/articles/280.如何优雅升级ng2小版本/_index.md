# 如何优雅升级ng2小版本

## 前言
前几天在Angular中文社区群里，有小伙伴询问ng项目升级，出现N多的 `Peer Dependencies`错误，吐槽很是影响coding心情。私下询问，发现对package文件中的版本号有点误会，我之前也遇到类似问题，在此做个小结。
这里的升级不是指ng1如何升级到ng2，仅以angular 2.0.1升级到当前2.2.0的时候需要注意的小细节。想了解 如何从ng1升级到ng2，请参考公众号之前文章[从ng1到ng2的平滑升级](./articles/260.从ng1到ng2的平滑升级[1]/_index.md)

## 目标
1. package文件版本号前面的符号有什么鬼？
2. 如何从ng2.0.1 优雅升级到 ng2.2.0(当前最新)

## package依赖包版本号
先来了解下package.json文件依赖包中常见的标点符号。这里，仅涉及如下符号：  `^`   `~`   `>=`  `<= `

### 只有版本号
package.json中，版本号如下：
举栗子： "@angular/core": "2.0.1"
什么鬼： 安装指定版本

### 符号 `^`
举栗子： "@angular/core": "^2.0.1" 
什么鬼： 安装该版本以及比该版本更新的版本，如： `2.0.1` , `2.0.2`, `2.1.0`, `2.7.0`, 但是，**3.x.x不会安装**

### 符号`~`
举栗子： "@angular/core": "~2.0.1" 
什么鬼:  只能安装 `2.0.1`， `2.0.2`， ... `2.0.9` 但是, **2.1.0就不可以了**

### 符号 `>= <=`
更有者，可以使用如下形式： >= ... <=
"@angular/core": ">=2.0.1<=3.0.0"
什么鬼： 表示安装的版本是在 2.0.2到3.0.0之前的，上下边界也在内。

## 优雅升级常用npm命令
上述仅是package.json涉及内容的几小点，更多内容，参考npmjs官方文档 [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)  和  [The semantic versioner for npm](https://docs.npmjs.com/misc/semver)
接下来，开始我们的优雅之旅吧！以我自己的ng2入门项目[ng2-starter-webpack](https://github.com/tancolo/angular2/tree/master/ng2-starter-webpack)项目为例子说明，如何优雅升级ng2小版本。
一句话总结升级步骤： ** 看版本，查依赖，修json，再重复。** 

**package.json 文件内容：**
```
"dependencies": {
    "@angular/common": "2.0.1",
    "@angular/compiler": "2.0.1",
    "@angular/core": "2.0.1",
    "@angular/forms": "2.0.1",
    "@angular/http": "2.0.1",
    "@angular/platform-browser": "2.0.1",
    "@angular/platform-browser-dynamic": "2.0.1",
    "@angular/router": "3.0.1",
    "@angular/upgrade": "2.0.1",
    "angular-in-memory-web-api": "0.1.1",
    "bootstrap": "3.3.5",
    "core-js": "2.4.1",
    "reflect-metadata": "0.1.6",
    "rxjs": "5.0.0-beta.12",
    "zone.js": "0.6.23"
  },
  "devDependencies": {
    "html-webpack-plugin": "^2.24.1",
    "ts-loader": "^0.9.5",
    "typescript": "^2.0.6",
    "typings": "^1.5.0",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  }
```

很显然，ng2包不是最新的，想升级到最新的依赖包，并且尽量避免在升级过程中出现error， 需要如下步骤。
注意，按照上面的package.json文件，`npm install`会出现问题，莫慌，挖的一个小坑！

```
`-- UNMET PEER DEPENDENCY zone.js@0.6.23
```
原因是 为了演示错误，有意降低了 zone.js的版本，正确版本是 **0.6.25**

### npm list --depth 0
**看版本**
查看当前项目package所记录的依赖包版本， 小伙伴们常用的是 `npm list`， 它的缺点是冗长，`npm list --depth 0`不会展开依赖包所需的依赖包版本。
```
$ npm list --depth 0
ng2-starter-webpack@0.0.1 E:\Project_Dev\Angularjs2\ng2-starter-webpack
+-- @angular/common@2.0.1
+-- @angular/compiler@2.0.1
+-- @angular/core@2.0.1
+-- @angular/forms@2.0.1
+-- @angular/http@2.0.1
+-- @angular/platform-browser@2.0.1
+-- @angular/platform-browser-dynamic@2.0.1
+-- @angular/router@3.0.1
+-- @angular/upgrade@2.0.1
+-- angular-in-memory-web-api@0.1.1
+-- bootstrap@3.3.5
+-- core-js@2.4.1
+-- html-webpack-plugin@2.24.1
+-- reflect-metadata@0.1.6
+-- rxjs@5.0.0-beta.12
+-- ts-loader@0.9.5
+-- typescript@2.0.10
+-- typings@1.5.0
+-- webpack@1.13.3
+-- webpack-dev-server@1.16.2
`-- UNMET PEER DEPENDENCY zone.js@0.6.23

npm ERR! peer dep missing: zone.js@^0.6.25, required by angular-in-memory-web-api@0.1.1

```

注意，其中的npm Error： angular-in-memory-web-api@0.1.1需要的zone.js版本是 `0.6.25`, 所以导致出现了错误，这也是常见的 `peer dependencies` 问题。
```
npm ERR! peer dep missing: zone.js@^0.6.25, required by angular-in-memory-web-api@0.1.1
```

只要修改为正确的版本`0.6.25`即可！


### npm outdated
该命令是查询当前package中有哪些依赖包是过时的，为升级做好准备。 结果如下
```
$ npm outdated
Package                                  Current         Wanted      Latest  Location
@angular/common                            2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/compiler                          2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/core                              2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/forms                             2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/http                              2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/platform-browser                  2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/platform-browser-dynamic          2.0.1          2.0.1       2.2.0  ng2-starter-webpack
@angular/router                            3.0.1          3.0.1       3.2.0  ng2-starter-webpack
@angular/upgrade                           2.0.1          2.0.1       2.2.0  ng2-starter-webpack
angular-in-memory-web-api                  0.1.1          0.1.1      0.1.15  ng2-starter-webpack
bootstrap                                  3.3.5          3.3.5       3.3.7  ng2-starter-webpack
reflect-metadata                           0.1.6          0.1.6       0.1.8  ng2-starter-webpack
rxjs                               5.0.0-beta.12  5.0.0-beta.12  5.0.0-rc.3  ng2-starter-webpack
ts-loader                                  0.9.5          0.9.5       1.2.1  ng2-starter-webpack
typescript                                2.0.10          2.1.1      2.0.10  ng2-starter-webpack
typings                                    1.5.0          1.5.0       2.0.0  ng2-starter-webpack
zone.js                                   0.6.25         0.6.25      0.6.26  ng2-starter-webpack

```
一目了然，当前的version， 最新的version。

不要猴急把package中的版本号都替换为最新的，要考虑依赖的问题。ng2的core依赖rxjs.js, zone.js， 把ng2升级到`2.2.0`，是否有必要把rxjs 或 zone.js升级为最新的版本呢？ 也不一定。


### npm view xxxpackage/xxx@x.x.x peerDependencies
**查依赖**
该命令告诉我们，具体某个包的依赖关系。
```
$ npm view @angular/core@2.2.0 peerDependencies
{ rxjs: '5.0.0-beta.12', 'zone.js': '^0.6.21' }
```
以查看 **@angular/core@2.2.0** 为例，它依赖 ** { rxjs: '5.0.0-beta.12', 'zone.js': '^0.6.21' } **,  也就是说升级**@angular/core** 到 ** 2.2.0 ** 没有必要升级rxjs, zone.js版本，即使他们有更新的版本。

再看一个依赖包： ** angular-in-memory-web-api@0.1.1 **

```
$ npm view angular-in-memory-web-api@0.1.1  peerDependencies

{ '@angular/core': '^2.0.0',
  '@angular/http': '^2.0.0',
  'reflect-metadata': '^0.1.3',
  rxjs: '5.0.0-beta.12',
  'zone.js': '^0.6.25' }

```
以上说明，当升级ng2相关库为 2.2.0的时候，可以不用升级  ** angular-in-memory-web-api@0.1.1 **

但是，修改完成 ng相关库为 2.2.0后，再次执行 npm install， 还是有错误
```
$ npm list --depth 0
ng2-starter-webpack@0.0.1 E:\Project_Dev\Angularjs2\ng2-starter-webpack
+-- UNMET PEER DEPENDENCY @angular/common@2.2.0
+-- @angular/compiler@2.2.0
+-- UNMET PEER DEPENDENCY @angular/core@2.2.0
+-- @angular/forms@2.2.0
+-- @angular/http@2.2.0
+-- UNMET PEER DEPENDENCY @angular/platform-browser@2.2.0
+-- @angular/platform-browser-dynamic@2.2.0
+-- @angular/router@3.0.1
+-- @angular/upgrade@2.2.0
+-- angular-in-memory-web-api@0.1.1
+-- bootstrap@3.3.5
+-- core-js@2.4.1
+-- html-webpack-plugin@2.24.1
+-- reflect-metadata@0.1.6
+-- rxjs@5.0.0-beta.12
+-- ts-loader@0.9.5
+-- typescript@2.0.10
+-- typings@1.5.0
+-- webpack@1.13.3
+-- webpack-dev-server@1.16.2
`-- zone.js@0.6.25

npm ERR! peer dep missing: @angular/common@2.0.1, required by @angular/router@3.0.1
npm ERR! peer dep missing: @angular/core@2.0.1, required by @angular/router@3.0.1
npm ERR! peer dep missing: @angular/platform-browser@2.0.1, required by @angular/router@3.0.1

```
本次是angular/router的版本太低了，@3.0.1 要求ng相关库是2.0.1， 2.2.0无法使用，所以需要升级angular/router 为3.2.0

### 修改，重复
上述的** 看版本，查依赖，修json ** 可能会重复多次，完成后，测试的工作也不能少，至少主流程要走一遍，确保升级不会导致出现运行问题。

## 小结
升级版本是个细致的活儿，需要科学的方法。否则容易出现问题，脑壳都会抓掉。再次总结下一般步骤吧！
#### step 1 看版本
npm list --depth 0
npm outdated

#### step 2 查看依赖
npm view xxxpackage/xxx@x.x.x peerDependencies

#### step 3 修json
#### step 4 再重复

