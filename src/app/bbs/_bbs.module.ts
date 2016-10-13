import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { BbsRoutingModule} from './_bbs-routing.module';
import SharedModule from '../_shared/_shared.module';
import {THREAD_COMPONENTS} from './thread/index';
import {BbsHomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BbsRoutingModule
  ],
  declarations: [...THREAD_COMPONENTS, BbsHomeComponent]
})
export default class BbsModule {
}
