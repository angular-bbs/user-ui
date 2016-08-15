import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_author.routing';
import {AUTHOR_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [...AUTHOR_COMPONENTS],
})
export default class AuthorModule {
}
