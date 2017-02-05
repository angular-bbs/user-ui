import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
// import AboutModule from './about/_about.module';
// import BbsModule from './bbs/_bbs.module';
// import LibraryModule from './library/_library.module';
// import UserModule from './user/_user.module';
import {ChangeTitle} from './_shared/services/change-title';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ChangeTitle],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/user'},
      {
        path: 'about', data: {title: '关于我们'},
        loadChildren: './about/_about.module'
      },
      {
        path: 'bbs', data: {title: '微站论坛'},
        loadChildren: './bbs/_bbs.module'
      },
      {
        path: 'library', data: {title: '资料中心'},
        loadChildren: './library/_library.module'
      },
      {
        path: 'user', data: {title: '用户中心'},
        loadChildren: './user/_user.module'
      },
      {path: '**', component: NotFoundComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
