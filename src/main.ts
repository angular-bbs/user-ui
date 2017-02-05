import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { bootloader } from '@angularclass/hmr';
// import './vendor';
import './main.scss';

// if (environment.production) {
//   enableProdMode();
// }

export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule);
}

bootloader(main);

