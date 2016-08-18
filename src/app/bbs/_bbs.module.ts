import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_bbs.routing';
import SharedModule from '../_shared/_shared.module';
import {THREAD_COMPONENTS} from './thread/index';
import {BbsHomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  declarations: [...THREAD_COMPONENTS, BbsHomeComponent]
})
export default class BbsModule {
}
