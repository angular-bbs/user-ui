import {Injectable} from '@angular/core';
import {Book} from '../../models/book';
import {Observable} from 'rxjs/Observable';
import {Link} from '../../models/link';
const items: Book[] = [
  {
    id: 'AngularJS深度剖析与最佳实践',
    title: 'AngularJS深度剖析与最佳实践',
    picture: require('./AngularJS深度剖析与最佳实践/cover.jpg'),
    description: require('./AngularJS深度剖析与最佳实践/_index.md'),
    authors: ['雪狼', '破狼', '彭洪伟'],
    storeUrls: [
      new Link('http://item.jd.com/11845736.html', '京东商城')
    ]
  },
  {
    id: 'ng-book2',
    title: 'Angular 2权威教程',
    picture: require('./ng-book2/cover.jpg'),
    description: require('./ng-book2/_index.md'),
    authors: ['Ari Lerner', 'Felipe Coury', 'Nate Murray', 'Carlos Taborda'],
    translators: ['Angular中文社区'],
    storeUrls: [
      new Link('http://www.ituring.com.cn/book/1874', '图灵社区')
    ]
  },
];
@Injectable()
export class BookApi {
  query(): Observable<Book> {
    return Observable.from(items);
  }
}
