import {RouterModule, Routes} from '@angular/router';
import {ArticleHomeComponent} from './home.component';
import {ArticleShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: ArticleHomeComponent},
  {path: ':id', component: ArticleShowComponent},
];
export const routing = RouterModule.forChild(routes);
