import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryHomeComponent} from './home.component';
import {routing} from './_library.routing';
import SharedModule from '../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [
    LibraryHomeComponent,
  ],
})
export default class LibraryModule {
}
