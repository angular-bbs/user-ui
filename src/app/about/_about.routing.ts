import {RouterModule, Routes} from '@angular/router';
import {AboutHomeComponent} from './home.component';
import {AboutJoinComponent} from './join.component';
import {AboutSiteComponent} from './site.component';
import {AboutUsComponent} from './us.component';
import BookModule from './book/_book.module';
import ShowcaseModule from './showcase/_showcase.module';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: AboutHomeComponent},
  {path: 'join', component: AboutJoinComponent},
  {path: 'site', component: AboutSiteComponent},
  {path: 'us', component: AboutUsComponent},
  {path: 'book', loadChildren: BookModule},
  {path: 'showcase', loadChildren: ShowcaseModule},
];
export const routing = RouterModule.forChild(routes);
