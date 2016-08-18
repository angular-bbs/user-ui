import {RouterModule, Routes} from '@angular/router';
import {AboutHomeComponent} from './home.component';
import {AboutJoinComponent} from './join.component';
import {AboutSiteComponent} from './site.component';
import {AboutUsComponent} from './us.component';
import {BookShowComponent} from './book/show.component';
import {BookHomeComponent} from './book/home.component';
import {ShowcaseShowComponent} from './showcase/show.component';
import {ShowcaseHomeComponent} from './showcase/home.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: AboutHomeComponent},
  {path: 'join', component: AboutJoinComponent},
  {path: 'site', component: AboutSiteComponent},
  {path: 'us', component: AboutUsComponent},
  {
    path: 'book',
    children: [
      {path: '', pathMatch: 'full', component: BookHomeComponent},
      {path: ':id', component: BookShowComponent},
    ],
  },
  {
    path: 'showcase',
    children: [
      {path: '', pathMatch: 'full', component: ShowcaseHomeComponent},
      {path: ':id', component: ShowcaseShowComponent},
    ],
  },
];
export const routing = RouterModule.forChild(routes);
