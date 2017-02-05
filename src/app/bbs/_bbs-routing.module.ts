import {RouterModule, Routes} from "@angular/router";
import {BbsHomeComponent} from "./home.component";
import {ThreadShowComponent} from "./thread/show.component";
import {ThreadCreateComponent} from "./thread/create.component";
import {ThreadHomeComponent} from "./thread/home.component";
import {NgModule} from '@angular/core';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: BbsHomeComponent,},
  {
    path: 'thread',
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'mine'},
      {path: 'mine', data: {title: '我的社区'}, pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'hot', data: {title: '最新帖'}, pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'latest', data: {title: '热门帖'}, pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'reward', data: {title: '悬赏贴'}, pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'create', data: {title: '发帖提问'}, pathMatch: 'full', component: ThreadCreateComponent},
      {path: ':id', data: {title: '帖子详情'}, component: ThreadShowComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BbsRoutingModule {
}
