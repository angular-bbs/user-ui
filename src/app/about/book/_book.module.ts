import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_book.routing';
import {BOOK_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';
import {RouterModule} from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    routing,
  ],
  declarations: [...BOOK_COMPONENTS],
})
export default class BookModule {
}
