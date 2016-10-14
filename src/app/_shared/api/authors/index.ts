import {Injectable} from "@angular/core";
import {Author} from "../../models/author";
import {Observable} from "rxjs/Observable";

let age = new Date().getFullYear() - 2009;

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
  },
  {
    id: 'wike',
    name: '袁志',
    bio: `在前端领域探索，永不止步`,
    description: require('./20.袁志.md'),
    avatar: require('./_images/袁志.jpg'),
    columnist: false,
    homepage: 'https://github.com/wike933'
  },
  {
    id: 'indooorsman',
    name: '王传业',
    bio: `前端老司机，驾龄${age}年`,
    description: require('./66.王传业.md'),
    avatar: require('./_images/王传业.jpg'),
    columnist: false,
    homepage: 'https://csser.me'
  }
];
@Injectable()
export class AuthorApi {
  query(params = {}): Observable<Author> {
    return Observable.from(items);
  }
}
