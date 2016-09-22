import {Injectable} from '@angular/core';
import {Author} from '../../models/author';
import {Observable} from 'rxjs/Observable';
const items: Author[] = [
  {
    id: '雪狼',
    name: '雪狼',
    bio: '好为人师，好为人师',
    description: require('./10.雪狼.md'),
    avatar: require('./_images/雪狼.jpg'),
    columnist: true,
    homepage: 'https://github.com/asnowwolf/'
  },
  {
    id: 'trotyl',
    name: '余泽江',
    bio: `You're not as good as you think you are`,
    description: require('./20.余泽江.md'),
    avatar: require('./_images/余泽江.jpg'),
    columnist: false,
    homepage: 'https://github.com/trotyl/'
  }
];
@Injectable()
export class AuthorApi {
  query(params = {}): Observable<Author> {
    return Observable.from(items);
  }
}
