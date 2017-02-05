import {RouterModule, Routes} from "@angular/router";
import {UserHomeComponent} from "./home.component";
import {UserLoginComponent} from "./login.component";
import {NgModule} from '@angular/core';
const routes: Routes = [
  {path: '', data: {title: '个人中心'}, pathMatch: 'full', component: UserHomeComponent},
  {path: 'login', data: {title: '登录'}, component: UserLoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule {
}

