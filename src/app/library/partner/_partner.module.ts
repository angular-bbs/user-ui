import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './_partner.routing';
import {PARTNER_COMPONENTS} from './index';
import SharedModule from '../../_shared/_shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
  ],
  declarations: [...PARTNER_COMPONENTS],
})
export default class PartnerModule {
}
