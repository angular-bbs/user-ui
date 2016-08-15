import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_bbs.routing';
import SharedModule from '../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
})
export default class BbsModule {
}
