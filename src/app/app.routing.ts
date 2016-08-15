import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import AboutModule from './about/_about.module';
import BbsModule from './bbs/_bbs.module';
import LibraryModule from './library/_library.module';
import UserModule from './user/_user.module';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/user',},
  {path: 'about', loadChildren: AboutModule,},
  {path: 'bbs', loadChildren: BbsModule,},
  {path: 'library', loadChildren: LibraryModule,},
  {path: 'user', loadChildren: UserModule,},
  {path: '**', component: NotFoundComponent},
];
export const routing = RouterModule.forRoot(routes);
