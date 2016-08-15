import {RouterModule, Routes} from '@angular/router';
import {LibraryHomeComponent} from './home.component';
import ArticleModule from './article/_article.module';
import AuthorModule from './author/_author.module';
import ColumnModule from './column/_column.module';
import NewsModule from './news/_news.module';
import PartnerModule from './partner/_partner.module';
import ResourceModule from './resource/_resource.module';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LibraryHomeComponent},
  {path: 'article', loadChildren: ArticleModule,},
  {path: 'author', loadChildren: AuthorModule,},
  {path: 'column', loadChildren: ColumnModule,},
  {path: 'news', loadChildren: NewsModule,},
  {path: 'partner', loadChildren: PartnerModule,},
  {path: 'resource', loadChildren: ResourceModule,},
];
export const routing = RouterModule.forChild(routes);
