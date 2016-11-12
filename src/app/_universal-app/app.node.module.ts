// Fix Material Support
import { __platform_browser_private__ } from '@angular/platform-browser';
function universalMaterialSupports(eventName: string): boolean { return Boolean(this.isCustomEvent(eventName)); }
__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;
// End Fix Material 


import {/*BrowserModule,*/ Title} from '@angular/platform-browser';
import {NgModule, NgModuleFactoryLoader, Inject, Optional, SkipSelf} from '@angular/core';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
// import {HttpModule} from '@angular/http';

import {AppComponent} from '../app.component';
import SharedModule from '../_shared/_shared.module';
import {NotFoundComponent} from '../not-found/not-found.component';
import {AppRoutingModule} from '../app-routing.module';
import {LeanNgModuleLoader} from '../lean-ng-module-loader';
import { CacheService } from './cache.service';

// import * as LRU from 'modern-lru';

export function getLRU(lru?: any) {
  // use LRU for node
  // return lru || new LRU(10);
  return lru || new Map();
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent, NotFoundComponent ],
  imports: [
    UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
    FormsModule,

    SharedModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    Title,
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    {
      provide: 'LRU',
      useFactory: getLRU,
      deps: [
        [new Inject('LRU'), new Optional(), new SkipSelf()]
      ]
    },
    CacheService
  ]
})
export class AppModule {
  constructor(public cache: CacheService) {

  }

  /**
   * We need to use the arrow function here to bind the context as this is a gotcha
   * in Universal for now until it's fixed
   */
  universalDoDehydrate = (universalCache) => {
    universalCache[CacheService.KEY] = JSON.stringify(this.cache.dehydrate());
  }

 /**
  * Clear the cache after it's rendered
  */
  universalAfterDehydrate = () => {
    // comment out if LRU provided at platform level to be shared between each user
    this.cache.clear();
  }
}
