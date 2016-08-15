import {Component} from '@angular/core';
import {BasePageComponent, NewsApi, Article, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'news-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class NewsShowComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: NewsApi) {
    super(activatedRoute);
  }

  item: Observable<Article>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id));
  }
}
