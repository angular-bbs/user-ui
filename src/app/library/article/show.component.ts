import {Component} from '@angular/core';
import {Article, ArticleApi, matchById, BasePageComponent} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'article-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class ArticleShowComponent extends BasePageComponent {
  constructor(private api: ArticleApi, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  item: Observable<Article>;

  reload(params: {id: string}) {
    this.item = this.api.query().find(matchById(params.id));
  }
}
