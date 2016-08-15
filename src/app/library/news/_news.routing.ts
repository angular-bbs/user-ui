import {RouterModule, Routes} from '@angular/router';
import {NewsHomeComponent} from './home.component';
import {NewsShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: NewsHomeComponent},
  {path: ':id', component: NewsShowComponent},
];
export const routing = RouterModule.forChild(routes);
