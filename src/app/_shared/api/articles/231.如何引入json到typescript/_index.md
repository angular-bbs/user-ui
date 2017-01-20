# 如何引入json文件到typescript

## 起因：
在ES6/ES205中，你可以import json文件到代码里，例如你创建一个*demo.json*文件
```js
{
  "name": "dapao"
}
```
然后你就可以在ES6/ES2015中直接导入它
```js
import * as data from './demo.json';
const name = data.name;
console.log(name);  //'daopao'
```
但是在typescript同样的代码会抛出异常
```js
Cannot find module 'demo.json'
```

## 解决方案：
在typescript2中，我们可以定义自己*.d.ts*[链接](http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html),如下面
```js
declare module "*.json" {
    const value: any;
    export default value;
}
```
下面代码就可以成功导入json文件
```js
import data from './demo.json';
const word = data.name;
console.log(word); // output 'dapao'
```


## 思考：
本文虽然很短，但是json文件作用是及其大的。在java里spring利用yaml进行配置，目前前端日益复杂，可能一个项目有很多配置参数。例如一个web前端给很多微信服务号使用，所以每个web部署都有自己的appId，为了减少网络请求，所以将一些不涉及隐私配置配置在json文件里。日常开发中我们可以定义三种json文件，1.dev.json 2.env.json 3.prod.json,
env.json
```js
{
  "env": "dev"
}
```
程序只需根据env.json的模式读取对应的配置json文件，这样上线可以随时热替换文件。不用因为代码里请求路径没改过来，得重新打包上传，更加灵活。当然npm打包时就可以区分生产环境和开发环境。多一种思路。
