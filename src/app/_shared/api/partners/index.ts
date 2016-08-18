import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Partner} from '../../models/partner';

const items: Partner[] = [
  {
    id: 'angular-io',
    avatar: require('./_images/angular.svg'),
    name: 'Angular官网（英文）',
    description: 'Angular 2官方网站，最新、最权威的技术资料',
    homepage: 'https://angular.io'
  },
  {
    id: 'insignts',
    avatar: require('./_images/tw-insights.jpg'),
    name: 'ThoughtWorks洞见',
    description: 'ThoughtWorks中国区的精品文章汇总',
    homepage: 'http://insights.thoughtworkers.org/'
  }
];

@Injectable()
export class PartnerApi {
  query(params = {}): Observable<Partner> {
    return Observable.from(items);
  }
}
