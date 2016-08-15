import {RouterModule, Routes} from '@angular/router';
import {PartnerHomeComponent} from './home.component';
import {PartnerShowComponent} from './show.component';
const routes: Routes = [
  {path: '', pathMatch: 'full', component: PartnerHomeComponent},
  {path: ':id', component: PartnerShowComponent},
];
export const routing = RouterModule.forChild(routes);
