import {RouterModule, Routes} from '@angular/router';
import {UserHomeComponent} from './home.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: UserHomeComponent},
];
export const routing = RouterModule.forChild(routes);
