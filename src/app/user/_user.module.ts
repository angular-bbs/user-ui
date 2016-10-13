import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { UserRoutingModule} from './_user-routing.module';
import {USER_COMPONENTS} from './index';
import SharedModule from '../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
  ],
  declarations: [...USER_COMPONENTS],
})
export default class UserModule {
}
