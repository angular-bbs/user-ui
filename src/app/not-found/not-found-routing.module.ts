import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {NotFoundComponent} from './not-found.component';

const routes: Routes = [
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NotFoundRoutingModule {
}

