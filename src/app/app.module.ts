import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgModuleFactoryLoader } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import SharedModule from './_shared/_shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { routing } from './app.routing';
import { RouterModule } from '@angular/router';
import { LeanNgModuleLoader } from './lean-ng-module-loader';

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
   routing,
  ],
  exports: [
    AppComponent
  ],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: LeanNgModuleLoader },
  ],
  // entryComponents: [AppComponent],
   bootstrap: [AppComponent]
})
export class AppModule {
}
