import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_article.routing';
import {ARTICLE_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';
import {ArticleDetailsComponent} from './details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [...ARTICLE_COMPONENTS],
  exports: [ArticleDetailsComponent],
})
export default class ArticleModule {
}
