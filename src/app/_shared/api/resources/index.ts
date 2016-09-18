import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../models/article';

const items: Article[] = [
  {
    id: 'Angular资源大全',
    image: require('../../_images/angular.svg'),
    title: 'Angular资源大全',
    summary: 'AngularClass收集的精品资源大全',
    content: require('./30.awesome/_index.md'),
    authors: ['AngularClass'],
    translators: ['雪狼'],
    originalUrl: 'https://github.com/AngularClass/awesome-angular2',
  },
  {
    id: 'PrimeNg',
    image: require('./10.prime-ng/logo.svg'),
    title: 'PrimeNg简介',
    summary: '一套优秀的企业级Angular组件库',
    content: require('./10.prime-ng/_index.md'),
    authors: ['雪狼'],
  },
  {
    id: 'Fuel UI',
    image: require('./20.fuel-ui/logo.png'),
    title: 'Fuel UI简介',
    summary: 'Angular 2原生Bootstrap组件',
    content: require('./20.fuel-ui/_index.md'),
    authors: ['雪狼'],
  }
];

@Injectable()
export class ResourceApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items);
  }
}
