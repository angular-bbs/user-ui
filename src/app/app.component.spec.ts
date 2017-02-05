/* tslint:disable:no-unused-variable */

import { addProviders, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: UserUi', () => {
  beforeEach(() => {
    addProviders([AppComponent]);
  });

  it('should create the app',
    inject([AppComponent], (app: AppComponent) => {
      expect(app).toBeTruthy();
    }));

  it('should have as title \'app works!\'',
    inject([AppComponent], (app: AppComponent) => {
    }));
});
