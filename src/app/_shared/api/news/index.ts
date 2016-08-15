import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../models/article';

const items: Article[] = [
  {
    id: 'AngularDart独立啦',
    image: require('./_images/split.svg'),
    title: 'AngularDart独立啦！',
    summary: 'Angular开发组决定分离出一个单独的Dart分支，任其自由发展',
    content: require('./10.AngularDart独立啦.md'),
    authors: ['Naomi Black'],
    originalUrl: 'http://angularjs.blogspot.hk/2016/07/a-dedicated-team-for-angulardart.html'
  }
];

@Injectable()
export class NewsApi {
  query(params = {}): Observable<Article> {
    return Observable.from(items);
  }
}
