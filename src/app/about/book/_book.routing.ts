import {RouterModule, Routes} from '@angular/router';
import {BookHomeComponent} from './home.component';
import {BookShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: BookHomeComponent},
  {path: ':id', component: BookShowComponent},
];
export const routing = RouterModule.forChild(routes);
