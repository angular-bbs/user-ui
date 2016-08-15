import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_news.routing';
import {NEWS_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';
import ArticleModule from '../article/_article.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArticleModule,
    routing
  ],
  declarations: [...NEWS_COMPONENTS],
})
export default class NewsModule {
}
