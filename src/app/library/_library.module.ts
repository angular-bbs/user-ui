import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryHomeComponent} from './home.component';
import {LibraryRoutingModule} from './_library-routing.module';
import SharedModule from '../_shared/_shared.module';
import {ARTICLE_COMPONENTS} from './article/index';
import {AUTHOR_COMPONENTS} from './author/index';
import {COLUMN_COMPONENTS} from './column/index';
import {NEWS_COMPONENTS} from './news/index';
import {PARTNER_COMPONENTS} from './partner/index';
import {RESOURCE_COMPONENTS} from './resource/index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LibraryRoutingModule,
  ],
  declarations: [
    LibraryHomeComponent,
    ...ARTICLE_COMPONENTS,
    ...AUTHOR_COMPONENTS,
    ...COLUMN_COMPONENTS,
    ...NEWS_COMPONENTS,
    ...PARTNER_COMPONENTS,
    ...RESOURCE_COMPONENTS,
  ],
})
export default class LibraryModule {
}
