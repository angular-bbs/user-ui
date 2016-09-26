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
  },
  {
    id: 'Angular 2正式发布',
    image: require('../../_images/angular.svg'),
    title: 'Angular 2正式发布',
    summary: '2016年中秋节，经过两年半的长跑，Angular 2终于正式发布了！',
    content: require('./20.Angular 2正式发布/_index.md'),
    authors: ['Jules Kremer'],
    translators: ['雪狼'],
  }
];

@Injectable()
export class NewsApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items);
  }
}
