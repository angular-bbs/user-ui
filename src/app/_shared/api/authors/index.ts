import {Injectable} from "@angular/core";
import {Author} from "../../models/author";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

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
  },
  {
    id: 'lhtin',
    name: '丁乐华',
    bio: 'Why didn\'t the spider go to school? Because she learned everything on the web.',
    description: require('./250.丁乐华.md'),
    avatar: require('./_images/250.丁乐华.jpg'),
    columnist: false,
    homepage: 'https://github.com/lhtin'
  },
  {
    id: 'timliu',
    name: 'Tim刘',
    bio: '小白小白小白',
    description: require('./Tim刘.md'),
    avatar: require('./_images/Tim刘.png'),
    columnist: false,
    homepage: 'https://github.com/rxjs-space'
  },
  {
    id: '王開寧',
    name: '王開寧',
    bio: '终于找到真爱的前端码农',
    description: require('./260.王開寧.md'),
    avatar: require('./_images/260.王開寧.jpg'),
    columnist: false,
    homepage: 'https://twincle.github.io'
  },
    {
    id: 'dapao',
    name: '大炮',
    bio: '上天不要移開險峻，請賜予吾攀登之力',
    description: require('./67.大炮.md'),
    avatar: require('./_images/Tim刘.png'),
    columnist: false,
    homepage: 'https://github.com/btcioner/About-ME'
  },
  {
    id: '木丁糖',
    name: '木丁糖',
    bio: '爱好前端开发的Android白面猿',
    description: require('./270.木丁糖.md'),
    avatar: require('./_images/木丁糖.jpg'),
    columnist: false,
    homepage: 'http://www.jianshu.com/users/d614825bc8a1/latest_articles'
  },
  {
    id: '易sense',
    name: '易sense',
    bio: '一生中可以喜欢很多人，但心疼的只有一个',
    description: require('./280.易sense.md'),
    avatar: require('./_images/易sense.jpg'),
    columnist: false,
    homepage: 'http://www.jianshu.com/users/d0244c5326c5/latest_articles'
  }
];

@Injectable()
export class AuthorApi {
  // AuthorApi.query可以直接用来模拟从数据库里查找作者信息。
  // 只是返回Observable.from([Authors])有些太含蓄了。
  // 查找作者信息操作结束后，如果找到了，返回Observable.of(author)
  // 找不到的话，应该是转到一个404页面，这里暂且返回一个Observable.of(spectreAuthor)

  // query可以分为queryOne以及queryAll，matchById这个有点儿绕


  queryOne(params: {id: string}): Observable<Author> {

    let index: number = null;

    // 用for loop来找author，不用Observable.from([]).find()
    // 因为find()如果找不到，上一行的Observable就成了Observable.never()了
    // 而Observable.never()不会调用observer的任何callback
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === params.id) {
        index = i  // 找到了，index改成i，找不到，index还是null
        break; // 找到了，不用接着找了。
      }
    }

    // \user-ui\src\app\_shared\api\articles\index.ts
    // 这个文章列表里，authors 一栏指向作者的 id，不是作者的 name
    // 如果在 authors 里填写 name，使用上面的 for loop by id 是找不到的，在文章页面点击作者名字就会 404，
    // 所以还要 for loop by name 再找一遍
    // 这样 `library/author/id` 和 `library/author/name` 都能找到作者页面
    if (index === null) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === params.id) {
          index = i;  // 找到了，index改成i，找不到，index还是null
          break;
        }
      }
    }

    let spectreAuthor: Author = {
      id: 'spectre',
      name: '我叫404',
      bio: '数据库里没有我，怎么办？',
      description: '你看我不到。',
      avatar: require('../articles/50.弯道超车！后端程序员的Angular快速指南/team.jpg'),
      columnist: false,
      homepage: 'https://wx.angular.cn/library/author'
    }

    let author$: Observable<Author>;
    let item: Author;

    if (index === null) {
      // author not found, item = spectreAuthor
      item = spectreAuthor;
    } else {
      // authoer found, item = author
      item = items[index];
    }

    return Observable.of(item)
  }

  queryAll(): Observable<Author[]> {
    return Observable.of(items)
  }
}
