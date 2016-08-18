import {RouterModule, Routes} from '@angular/router';
import ThreadModule from './thread/_thread.module';
import {BbsHomeComponent} from './home.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: BbsHomeComponent,},
  {path: 'thread', loadChildren: ThreadModule},
];
export const routing = RouterModule.forChild(routes);
