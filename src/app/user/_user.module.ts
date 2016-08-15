import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_user.routing';
import {USER_COMPONENTS} from './index';
import SharedModule from '../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [...USER_COMPONENTS],
})
export default class UserModule {
}
