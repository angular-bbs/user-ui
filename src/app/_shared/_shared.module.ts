import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_APIS } from './api/index';
import { RouterModule } from '@angular/router';
import { SHARED_COMPONENTS } from './components/index';
import { SHARED_PIPES } from './pipes/index';
import { SHARED_SERVICES } from './services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
  exports: [...SHARED_COMPONENTS, ...SHARED_PIPES],
})
export default class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...SHARED_APIS, ...SHARED_SERVICES],
    };
  }
}
