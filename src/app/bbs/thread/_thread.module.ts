import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_thread.routing';
import {THREAD_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';
import {ThreadListComponent} from './list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [...THREAD_COMPONENTS],
  exports: [ThreadListComponent]
})
export default class ThreadModule {
}
