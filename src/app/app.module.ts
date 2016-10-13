import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule, NgModuleFactoryLoader} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import SharedModule from './_shared/_shared.module';
import {NotFoundComponent} from './not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {LeanNgModuleLoader} from './lean-ng-module-loader';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    SharedModule.forRoot(),
    AppRoutingModule,
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
