import {Component} from '@angular/core';
import {BasePageComponent, ArticleApi, Article} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'article-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class ArticleHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ArticleApi) {
    super(activatedRoute);
  }

  items: Observable<Article[]>;

  reload(params: {author: string, tag: string, column: string}): void {
    this.items = this.api.query()
      .filter(matchByAuthor(params.author))
      .filter(matchByTag(params.tag))
      .filter(matchByColumn(params.column))
      .toArray();
  }
}

function matchByAuthor(author: string): (item)=>boolean {
  return (item)=> {
    return !author || item.authors.indexOf(author) !== -1
  }
}

function matchByTag(tag: string): (item)=>boolean {
  return (item)=> {
    return !tag || item.tags && item.tags.indexOf(tag) !== -1
  }
}

function matchByColumn(column: string): (item)=>boolean {
  return (item)=> {
    return !column || item.column === column
  }
}
