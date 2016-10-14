import {RouterModule, Routes} from '@angular/router';
import {LibraryHomeComponent} from './home.component';
import {ArticleHomeComponent} from './article/home.component';
import {ArticleShowComponent} from './article/show.component';
import {AuthorHomeComponent} from './author/home.component';
import {AuthorShowComponent} from './author/show.component';
import {ColumnHomeComponent} from './column/home.component';
import {ColumnShowComponent} from './column/show.component';
import {NewsHomeComponent} from './news/home.component';
import {NewsShowComponent} from './news/show.component';
import {PartnerHomeComponent} from './partner/home.component';
import {PartnerShowComponent} from './partner/show.component';
import {ResourceHomeComponent} from './resource/home.component';
import {ResourceShowComponent} from './resource/show.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LibraryHomeComponent},
  {
    path: 'article',
    data: {title: '精品文章'},
    children: [
      {path: '', pathMatch: 'full', component: ArticleHomeComponent},
      {path: ':id', data: {title: '文章详情'}, pathMatch: 'full', component: ArticleShowComponent},
    ],
  },
  {
    path: 'author',
    data: {title: '作者详情'},
    children: [
      {path: '', pathMatch: 'full', component: AuthorHomeComponent},
      {path: ':id', pathMatch: 'full', component: AuthorShowComponent},
    ],
  },
  {
    path: 'column',
    data: {title: '技术专栏'},
    children: [
      {path: '', pathMatch: 'full', component: ColumnHomeComponent},
      {path: ':id', pathMatch: 'full', component: ColumnShowComponent},
    ],
  },
  {
    path: 'news',
    data: {title: '前沿观察'},
    children: [
      {path: '', pathMatch: 'full', component: NewsHomeComponent},
      {path: ':id', pathMatch: 'full', component: NewsShowComponent},
    ],
  },
  {
    path: 'partner',
    data: {title: '友情链接'},
    children: [
      {path: '', pathMatch: 'full', component: PartnerHomeComponent},
      {path: ':id', pathMatch: 'full', component: PartnerShowComponent},
    ],
  },
  {
    path: 'resource',
    data: {title: '资源雷达'},
    children: [
      {path: '', pathMatch: 'full', component: ResourceHomeComponent},
      {path: ':id', pathMatch: 'full', component: ResourceShowComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LibraryRoutingModule {
}

