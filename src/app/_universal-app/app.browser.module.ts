import {/*BrowserModule,*/ Title} from '@angular/platform-browser';
import {NgModule, NgModuleFactoryLoader} from '@angular/core';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; // for AoT we need to manually split universal packages
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
// import {HttpModule} from '@angular/http';

import {AppComponent} from '../app.component';
import SharedModule from '../_shared/_shared.module';
import {NotFoundComponent} from '../not-found/not-found.component';
import {AppRoutingModule} from '../app-routing.module';
import {LeanNgModuleLoader} from '../lean-ng-module-loader';
import { CacheService } from './cache.service';

export function getLRU() {
  return new Map();
}

// TODO(gdi2290): refactor into Universal
export const UNIVERSAL_KEY = 'UNIVERSAL_CACHE';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent, NotFoundComponent ],
  imports: [
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included

    // BrowserModule,
    FormsModule,
    // HttpModule,
    // RouterModule, // duplicate with SharedModule
    SharedModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    Title,
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    { provide: 'LRU', useFactory: getLRU, deps: [] },
    CacheService
  ]

})
export class AppModule {
  constructor(public cache: CacheService) {
    // TODO(gdi2290): refactor into a lifecycle hook
    this.doRehydrate();
  }

  doRehydrate() {
    let defaultValue = {};
    let serverCache = this._getCacheValue(CacheService.KEY, defaultValue);
    this.cache.rehydrate(serverCache);
  }

  _getCacheValue(key: string, defaultValue: any): any {
    // browser
    const win: any = window;
    if (win[UNIVERSAL_KEY] && win[UNIVERSAL_KEY][key]) {
      let serverCache = defaultValue;
      try {
        serverCache = JSON.parse(win[UNIVERSAL_KEY][key]);
        if (typeof serverCache !== typeof defaultValue) {
          console.log('Angular Universal: The type of data from the server is different from the default value type');
          serverCache = defaultValue;
        }
      } catch (e) {
        console.log('Angular Universal: There was a problem parsing the server data during rehydrate');
        serverCache = defaultValue;
      }
      return serverCache;
    } else {
      console.log('Angular Universal: UNIVERSAL_CACHE is missing');
    }
    return defaultValue;
  }
}
