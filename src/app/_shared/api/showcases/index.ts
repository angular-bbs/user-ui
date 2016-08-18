import {Injectable} from '@angular/core';
import {Showcase} from '../../models/showcase';
import {Observable} from 'rxjs/Observable';
const items: Showcase[] = [
  {
    id: 'iFish',
    title: 'iFISH',
    url: 'http://www.ifishonline.org/',
    author: 'ThoughtWorks',
    customer: '智渔科技',
    description: require('./10.ifish.md'),
    picture: require('./_images/ifish.svg'),
  }
];
@Injectable()
export class ShowcaseApi {
  query(params = {}): Observable<Showcase> {
    return Observable.from(items);
  }
}
