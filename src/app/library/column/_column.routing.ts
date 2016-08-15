import {RouterModule, Routes} from '@angular/router';
import {ColumnHomeComponent} from './home.component';
import {ColumnShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: ColumnHomeComponent},
  {path: ':id', component: ColumnShowComponent},
];
export const routing = RouterModule.forChild(routes);
