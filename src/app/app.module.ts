import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule, NgModuleFactoryLoader} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import SharedModule from './_shared/_shared.module';
// import {NotFoundComponent} from './not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {LeanNgModuleLoader} from './lean-ng-module-loader';
import LibraryModule from './library/_library.module';
import {NotFoundModule} from './not-found/not-found.module';

@NgModule({
  declarations: [
    AppComponent,
    // NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    LibraryModule, // add this module in the root to avoid lazy loading
    NotFoundModule // moved NotFoundComponent to this module for routing concerns
  ],
  exports: [
    AppComponent
  ],
  providers: [
    Title
    // { provide: NgModuleFactoryLoader, useClass: LeanNgModuleLoader },
  ],
  // entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
