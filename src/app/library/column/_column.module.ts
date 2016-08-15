import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_column.routing';
import {COLUMN_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  declarations: [...COLUMN_COMPONENTS],
})
export default class ColumnModule {
}
