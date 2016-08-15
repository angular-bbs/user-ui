import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_resource.routing';
import {RESOURCE_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';
import ArticleModule from '../article/_article.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArticleModule,
    routing,
  ],
  declarations: [...RESOURCE_COMPONENTS],
})
export default class ResourceModule {
}
