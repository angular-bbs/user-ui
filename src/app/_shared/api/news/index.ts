import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../models/article';

const items: Article[] = [
  {
    id: 'Angular 2 Final即将到来！',
    image: require('./10.Angular 2 Final即将到来/final.svg'),
    title: 'Angular 2 Final即将到来！！',
    summary: 'Angular 2 Final即将到来，敬请期待',
    content: require('./10.Angular 2 Final即将到来/_index.md'),
    authors: ['雪狼'],
  }
];

@Injectable()
export class NewsApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items);
  }
}
