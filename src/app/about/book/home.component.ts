import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookApi, BasePageComponent, Book, MenuItem} from '../../_shared';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'book-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class BookHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: BookApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params): void {
    this.items = this.api.query()
      .map(bookToMenuItem)
      .toArray();
  }
}

function bookToMenuItem(book: Book): MenuItem {
  return {
    title: book.title,
    icon: book.picture,
    description: `作者：${book.authors.join(' ')}`,
    url: `/about/book/${book.id}`
  }
}
