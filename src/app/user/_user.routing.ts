import {RouterModule, Routes} from "@angular/router";
import {UserHomeComponent} from "./home.component";
import {UserLoginComponent} from "./login.component";
const routes: Routes = [
  {path: '', data: {title: '个人中心'}, pathMatch: 'full', component: UserHomeComponent},
  {path: 'login', data: {title: '登录'}, component: UserLoginComponent},
];
export const routing = RouterModule.forChild(routes);
