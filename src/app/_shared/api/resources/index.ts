import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../models/article';

const items: Article[] = [
  {
    id: 'Fuel UI',
    image: require('./_images/fuel-ui.png'),
    title: 'Fuel UI',
    summary: 'Angular 2原生Bootstrap组件',
    content: require('./10.fuel-ui.md'),
    authors: ['雪狼'],
  }
];

@Injectable()
export class ResourceApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items);
  }
}
