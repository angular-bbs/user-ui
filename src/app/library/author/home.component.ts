import {Component} from '@angular/core';
import {AuthorApi, Author, BasePageComponent, matchById, MenuItem} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'author-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class AuthorHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: AuthorApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params: {id: string}): void {
    this.items = this.api.query()
      .find(matchById(params.id))
      .map(authorToMenuItem)
      .toArray();
  }
}

function authorToMenuItem(author: Author): MenuItem {
  return {
    icon: author.avatar,
    description: author.bio,
    title: author.name,
    url: `./${author.id}`
  }
}
