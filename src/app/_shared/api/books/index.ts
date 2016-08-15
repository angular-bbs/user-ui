import {Injectable} from '@angular/core';
import {Book} from '../../models/book';
import {Observable} from 'rxjs/Observable';
import {Link} from '../../models/link';
const items: Book[] = [
  {
    id: 'AngularJS深度剖析与最佳实践',
    title: 'AngularJS深度剖析与最佳实践',
    picture: require('./_images/angularjs-deep-dive.jpg'),
    description: 'Angular 1的高级读本，雪狼与破狼的联袂之作。本书是两位一线技术专家的实战经验总结，如果你仍然不得不留在Angular 1，那么本书会帮助你用Angular 2的思想来写Angular 1。',
    authors: ['雪狼', '破狼', '彭洪伟'],
    storeUrls: [
      new Link('http://item.jd.com/11845736.html', '京东商城')
    ]
  }
];
@Injectable()
export class BookApi {
  query(): Observable<Book> {
    return Observable.from(items);
  }
}
