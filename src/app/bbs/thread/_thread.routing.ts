import {RouterModule, Routes} from '@angular/router';
import {ThreadShowComponent} from './show.component';
import {ThreadCreateComponent} from './create.component';
import {ThreadHomeComponent} from './home.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'mine'},
  {path: 'mine', pathMatch: 'full', component: ThreadHomeComponent},
  {path: 'hot', pathMatch: 'full', component: ThreadHomeComponent},
  {path: 'latest', pathMatch: 'full', component: ThreadHomeComponent},
  {path: 'reward', pathMatch: 'full', component: ThreadHomeComponent},
  {path: 'create', pathMatch: 'full', component: ThreadCreateComponent},
  {path: ':id', component: ThreadShowComponent},
];
export const routing = RouterModule.forChild(routes);
