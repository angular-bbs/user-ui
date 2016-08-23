import {RouterModule, Routes} from "@angular/router";
import {NotFoundComponent} from "./not-found/not-found.component";
import AboutModule from "./about/_about.module";
import BbsModule from "./bbs/_bbs.module";
import LibraryModule from "./library/_library.module";
import UserModule from "./user/_user.module";
import {ChangeTitle} from "./_shared/services/change-title";

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ChangeTitle],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/user'},
      {path: 'about', data: {title: '关于我们'}, loadChildren: AboutModule,},
      {path: 'bbs', data: {title: '微站论坛'}, loadChildren: BbsModule,},
      {path: 'library', data: {title: '资料中心'}, loadChildren: LibraryModule,},
      {path: 'user', data: {title: '用户中心'}, loadChildren: UserModule,},
      {path: '**', component: NotFoundComponent},
    ]
  },
];
export const routing = RouterModule.forRoot(routes);
