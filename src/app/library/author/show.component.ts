import {Component} from '@angular/core';
import {AuthorApi, Author, BasePageComponent, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'author-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class AuthorShowComponent extends BasePageComponent {
  constructor(private api: AuthorApi, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  item: Observable<Author>;

  reload(params: {id: string}) {
    this.item = this.api.queryOne(params)
      .do((item: Author)=> {
        // 根据api.query，如果没找到的话，
        //    会返回一个假的author， spectreAuthor
        // 所以就不用`if(item)`来检查item是否是undefined了
        // 这是权宜之计，正常情况下，没找到的话应该转到404
        document.title = `${item.name} - 作者 - Angular中文社区`;
      });
  }
}
