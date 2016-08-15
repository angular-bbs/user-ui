# 表单的救赎

## 为什么表单让你头疼？

一句话：太复杂。

在很多商用系统中，表单可谓处于绝对的中心位置。从显示到提交，表单充满着各种业务规则。以注册新用户为例：

- 某些字段是必填的。
> 这是最简单也最常用的规则，判断起来很简单。
- 用户名不能小于四位。
> 这是最简单也最常用的规则，判断起来很简单，只是多了个参数。
- 密码必须至少包含字母、数字、特殊符号中的两种。
> 这个比以前复杂了，需要写函数才能做验证。
- 确认密码必须和已经输入的密码完全一致。
> 这个不但需要写函数，而且还需要引用其它变量。
- 用户名不能与现有用户名重复
> 这个不但要写函数，而且还必须和远端服务器通讯才能得到结果，更麻烦的是：这个过程是异步的。

我们理想的表单模板是怎样的？

```html
<input required minlength="6" (remoteCheck)="checkUsername(username)"
       name="username" type="text" placeholder="用户名" />
       
<input required minlength="8" maxlength="20" [passwordComplex]="2"
       name="password" type="password" placeholder="密码"/>
       
<input required [sameAs]="password"
       name="confirm-password" type="password" placeholder="确认密码"/>

```

这里省略了所有无关代码以突出重点：

1. 我们使用了HTML固有的required属性来表达某些字段是必填项。
1. username的验证中，我们使用了HTML固有的`minlength`属性来体现这项规则。
1. username的验证中，我们使用了一个自定义验证器`(checkUsername)`来向远端服务器发起请求，验证用户名是否可用。
1. password的验证中，我们使用了一个自定义验证器`[passwordComplex]`来表达这项规则。
1. confirm-password的验证中，我们使用了一个自定义验证器`[sameAs]`来表达这项规则，并且把现有密码传给它。

这是一个简化到极点的DSL（领域特定语言），即使非程序员也能大致读懂它的含义。但是，理想很丰满，现实很骨感。
在以前的技术中，想要实现这样的DSL并不容易，在Angular 1中虽然也能够实现，但是比较繁琐。

我们来看看在Angular 2中`passwordComplex`验证器的实现：

```typescript
import { Directive, forwardRef } from "@angular/core";
import { Validator, NG_VALIDATORS, AbstractControl } from "@angular/forms";
@Directive({
  selector: '[passwordComplex][formControlName],[passwordComplex][formControl],[passwordComplex][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordComplexValidator),
      multi: true
    }
  ]
})
export class PasswordComplexValidator implements Validator {
  constructor() {
  }

  validate(c: AbstractControl): {[key: string]: any} {
    var score = complexScore(c.value);
    let tooSimple = score < 2;
    if (tooSimple) {
      return {complex: {requiredScore: 2, actuallyScore: score}};
    }
  }
}

function complexScore(value: string): number {
  if (!value) {
    return 0;
  }
  var score = 0;
  if (value.match(/\d/)) {
    ++score;
  }
  if (value.match(/[A-Za-z]/)) {
    ++score;
  }
  if (value.match(/[!-/:-@[-`{-~]/)) {
    ++score;
  }
  return Math.round(score);
}
```

待续……
