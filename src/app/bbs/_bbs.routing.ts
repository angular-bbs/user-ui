import {RouterModule, Routes} from '@angular/router';
import ThreadModule from './thread/_thread.module';
const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'thread',},
  {path: 'thread', loadChildren: ThreadModule},
];
export const routing = RouterModule.forChild(routes);
