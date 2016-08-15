import {RouterModule, Routes} from '@angular/router';
import {ResourceHomeComponent} from './home.component';
import {ResourceShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: ResourceHomeComponent},
  {path: ':id', component: ResourceShowComponent},
];
export const routing = RouterModule.forChild(routes);
