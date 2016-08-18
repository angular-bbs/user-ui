import {RouterModule, Routes} from '@angular/router';
import {BbsHomeComponent} from './home.component';
import {ThreadShowComponent} from './thread/show.component';
import {ThreadCreateComponent} from './thread/create.component';
import {ThreadHomeComponent} from './thread/home.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: BbsHomeComponent,},
  {
    path: 'thread',
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'mine'},
      {path: 'mine', pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'hot', pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'latest', pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'reward', pathMatch: 'full', component: ThreadHomeComponent},
      {path: 'create', pathMatch: 'full', component: ThreadCreateComponent},
      {path: ':id', component: ThreadShowComponent},
    ],
  },
];
export const routing = RouterModule.forChild(routes);
