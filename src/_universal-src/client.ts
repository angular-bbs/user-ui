import { platformUniversalDynamic } from 'angular2-universal';
import { enableProdMode } from '@angular/core';
import { AppModule } from '../app/_universal-app/app.browser.module';
import { bootloader } from '@angularclass/hmr';
// import './vendor';
import '../main.scss';

// if (environment.production) {
//   enableProdMode();
// }

// enable prod for faster renders
enableProdMode();

const platformRef = platformUniversalDynamic();

// on document ready bootstrap Angular 2
document.addEventListener('DOMContentLoaded', () => {

  platformRef.bootstrapModule(AppModule);

});
