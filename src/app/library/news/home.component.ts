import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NewsApi, BasePageComponent, Article, MenuItem} from '../../_shared';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'news-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class NewsHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: NewsApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params): void {
    this.items = this.api.query()
      .map(newsToMenuItem)
      .toArray();
  }
}

function newsToMenuItem(news: Article): MenuItem {
  return {
    title: news.title,
    icon: news.image,
    description: news.summary,
    url: `/library/news/${news.id}`
  }
}
