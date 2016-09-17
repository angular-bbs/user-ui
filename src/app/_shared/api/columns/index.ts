import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Column} from '../../models/column';

const items: Column[] = [
  {
    id: '雪狼湖',
    name: '雪狼湖',
    bio: '感受一位十八年技术老兵的热忱',
    description: '茶前漫坐，听雪狼谈古论今，分析技术表里，享受不一样的思维盛宴',
    authors: ['雪狼'],
    tags: ['从前', '现在', '将来', '奇闻', '轶事', '放松', '烧脑'],
    avatar: require('./_images/snowwolf.jpg')
  },
  {
    id: 'trotyl',
    name: `Trotyl's Workspace`,
    bio: '',
    description: '',
    authors: ['trotyl'],
    tags: [''],
    avatar: require('./_images/trotyl.jpg')
  }
];

@Injectable()
export class ColumnApi {
  query(params = {}): Observable<Column> {
    return Observable.from(items);
  }
}
