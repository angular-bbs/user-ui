import {RouterModule, Routes} from '@angular/router';
import {AuthorHomeComponent} from './home.component';
import {AuthorShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: AuthorHomeComponent},
  {path: ':id', component: AuthorShowComponent},
];
export const routing = RouterModule.forChild(routes);
