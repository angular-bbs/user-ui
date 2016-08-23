import {Component} from '@angular/core';
import {BasePageComponent, BookApi, Book, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'book-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class BookShowComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: BookApi) {
    super(activatedRoute);
  }

  item: Observable<Book>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id))
      .do((item: Book)=> {
        document.title = `${item.title} - Angular中文社区`;
      });
  }
}
