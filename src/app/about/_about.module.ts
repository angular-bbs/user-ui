import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ABOUT_COMPONENTS} from './index';
import SharedModule from '../_shared/_shared.module';
import {routing} from './_about.routing';
import {RouterModule} from '@angular/router';
import {BOOK_COMPONENTS} from './book/index';
import {SHOWCASE_COMPONENTS} from './showcase/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    routing,
  ],
  declarations: [...ABOUT_COMPONENTS, ...BOOK_COMPONENTS, ...SHOWCASE_COMPONENTS],
})
export default class AboutModule {
}
