import {Injectable} from '@angular/core';
import * as uuid from 'node-uuid';

@Injectable()
export class Auth {
  constructor() {
    if (!this.csrfToken) {
      this.nextCsrfToken();
    }
  }

  get csrfToken(): string {
    return sessionStorage.getItem('csrfToken');
  }

  set csrfToken(value: string) {
    sessionStorage.setItem('csrfToken', value);
  }

  code: string;

  nextCsrfToken(): void {
    this.csrfToken = uuid.v4();
  }
}
