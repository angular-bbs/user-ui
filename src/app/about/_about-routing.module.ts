import {RouterModule, Routes} from '@angular/router';
import {AboutHomeComponent} from './home.component';
import {AboutJoinComponent} from './join.component';
import {AboutSiteComponent} from './site.component';
import {AboutUsComponent} from './us.component';
import {BookShowComponent} from './book/show.component';
import {BookHomeComponent} from './book/home.component';
import {ShowcaseShowComponent} from './showcase/show.component';
import {ShowcaseHomeComponent} from './showcase/home.component';
import {NgModule} from '@angular/core';
const routes: Routes = [
  {path: '', pathMatch: 'full', data: {title: '首页'}, component: AboutHomeComponent},
  {path: 'join', data: {title: '合作共赢'}, component: AboutJoinComponent},
  {path: 'site', data: {title: '中文官网'}, component: AboutSiteComponent},
  {path: 'us', data: {title: '中文社区'}, component: AboutUsComponent},
  {
    path: 'book',
    data: {title: '图书推荐'},
    children: [
      {path: '', pathMatch: 'full', component: BookHomeComponent},
      {path: ':id', component: BookShowComponent},
    ],
  },
  {
    path: 'showcase',
    data: {title: '成功案例'},
    children: [
      {path: '', pathMatch: 'full', component: ShowcaseHomeComponent},
      {path: ':id', component: ShowcaseShowComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AboutRoutingModule {
}
