# ng2-webstorage的使用方法
## HTML5的web存储
使用HTML5可以在本地存储用户的浏览数据。
早些时候,本地存储使用的是 cookie。但是Web 存储需要更加的安全与快速. 这些数据不会被保存在服务器上，但是这些数据只用于用户请求网站数据上.它也可以存储大量的数据，而不影响网站的性能.
数据以 键/值 对存在, web网页的数据只允许该网页访问使用。<br>
客户端存储数据的两个对象为：
localStorage - 没有时间限制的数据存储。
sessionStorage - 针对一个 session 的数据存储。
### localStorage使用方法是这样的：
```
localStorage.sitename="我的网站";
document.getElementById("result").innerHTML=localStorage.sitename;
```
### sessionStorage使用方法是这样的：
```
if (sessionStorage.clickcount){
    sessionStorage.clickcount=Number(sessionStorage.clickcount)+1;
}
else{
    sessionStorage.clickcount=1;
}
document.getElementById("result").innerHTML=
"在这个会话中你已经点击了该按钮 " + sessionStorage.clickcount + " 次 ";
```
## 在angular2中也可以使用web存储
### 具体的使用方法是：
#### 首先先要在你的项目中安装ng2-webstorage:
```
npm install --save ng2-webstorage
```
#### 下一步在你的module中注册这个library
```
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Ng2Webstorage} from 'ng2-webstorage';

@NgModule({
    declarations: [...],
    imports: [
        BrowserModule,
        Ng2Webstorage,
    ],
    bootstrap: [...]
})
export class AppModule {
}
```
#### 如果你使用的是systemJS，你还要在你的config中加入引用
```
System.config({
        map: { 
            ...,
            'ng2-webstorage': 'node_modules/ng2-webstorage'
        },
        packages: {
            ...,
            'ng2-webstorage': {main: 'bundles/core.umd.js',
             defaultExtension: 'js'}
        }
    });
```
#### 做好了基本的配置之后，就可以开始使用了。
##### 使用LocalStorageService的store方法创建或更新local storage中的对象
```
import {Component} from '@angular/core';
import {LocalStorageService} from 'ng2-webstorage';

@Component({
    selector: 'foo',
    template: `
        <section><input type="text" [(ngModel)]="attribute"/></section>
        <section><button (click)="saveValue()">Save</button></section>
    `,
})
export class FooComponent {
    attribute;
    constructor(private storage:LocalStorageService) {}
    saveValue() {
      this.storage.store('boundValue', this.attribute);
    }
}
```
每次点击"Save"按钮，就会将attribute的值存储到localstorage的"boundValue"键对应的值中
##### 使用LocalStorageService的retrieve方法返回local storage中的对象
如果你想要取得webstorage中存储的值,只需在你的控件类中执行
```
constructor(private storage:LocalStorageService) {}
    retrieveValue() {
      this.attribute = this.storage.retrieve('boundValue');
    }
```
##### 还可以使用LocalStorageService的clear方法清除local storage中的对象
```
constructor(private storage:LocalStorageService) {}
    clearItem() {
      this.storage.clear('boundValue');
    }
```
#### ng2-webstorage还可以绑定控件类中的值或对象，在需要的时候用observe订阅这个对象,在绑定的值或对象发生改变的时候，local storage中的对象也会发生改变。
##### 绑定控件类中的值或对象
```
import {LocalStorageService, LocalStorage} from 'ng2-webstorage';

export class FooComponent {
@LocalStorage('boundValue')
    boundAttribute;
    ...
}
```
##### 订阅local storage对象
```
export class FooComponent {
    constructor(private storage:LocalStorageService) {}
    ngOnInit() {
      this.storage.observe('boundValue')
        .subscribe((newValue) => {
          console.log(newValue);
        })
    }
}
```
这种功能主要用在路由中，在不同的网页间共享同一个对象或值，并监控值的变化。
angular2中的sessionStorage和localStorage差不多，只是把引用LocalStorageService改为SessionStorageService。

以上是我在做项目时候的一点小小的体会，其实用路由守卫应该也可以实现...
