import {RouterModule, Routes} from '@angular/router';
import {ShowcaseHomeComponent} from './home.component';
import {ShowcaseShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: ShowcaseHomeComponent},
  {path: ':id', component: ShowcaseShowComponent},
];
export const routing = RouterModule.forChild(routes);
