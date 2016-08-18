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

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LibraryHomeComponent},
  {
    path: 'article',
    children: [
      {path: '', pathMatch: 'full', component: ArticleHomeComponent},
      {path: ':id', pathMatch: 'full', component: ArticleShowComponent},
    ],
  },
  {
    path: 'author',
    children: [
      {path: '', pathMatch: 'full', component: AuthorHomeComponent},
      {path: ':id', pathMatch: 'full', component: AuthorShowComponent},
    ],
  },
  {
    path: 'column',
    children: [
      {path: '', pathMatch: 'full', component: ColumnHomeComponent},
      {path: ':id', pathMatch: 'full', component: ColumnShowComponent},
    ],
  },
  {
    path: 'news',
    children: [
      {path: '', pathMatch: 'full', component: NewsHomeComponent},
      {path: ':id', pathMatch: 'full', component: NewsShowComponent},
    ],
  },
  {
    path: 'partner',
    children: [
      {path: '', pathMatch: 'full', component: PartnerHomeComponent},
      {path: ':id', pathMatch: 'full', component: PartnerShowComponent},
    ],
  },
  {
    path: 'resource',
    children: [
      {path: '', pathMatch: 'full', component: ResourceHomeComponent},
      {path: ':id', pathMatch: 'full', component: ResourceShowComponent},
    ],
  },
];
export const routing = RouterModule.forChild(routes);
