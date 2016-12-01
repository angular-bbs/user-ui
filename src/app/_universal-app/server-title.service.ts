import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Injectable()
export class ServerTitle extends Title {
  private _document;

  constructor(@Inject(DOCUMENT) document) {
    super();
    this._document = document;
  }

  /**
   * Get the title of the current HTML document.
   * @returns {string}
   */
  getTitle(): string {
    return this._document.title;
  };

  /**
   * Set the title of the current HTML document.
   * @param newTitle
   */
  setTitle(newTitle: string): void {
    this._document.title = newTitle;
  }
}