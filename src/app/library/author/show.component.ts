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
    this.item = this.api.query()
      .find(matchById(params.id))
      .do((item: Author)=> {
        document.title = `${item.name} - 作者 - Angular中文社区`;
      });
  }
}
