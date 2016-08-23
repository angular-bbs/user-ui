import {Component} from '@angular/core';
import {BasePageComponent, ResourceApi, Article, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'resource-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class ResourceShowComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ResourceApi) {
    super(activatedRoute);
  }

  item: Observable<Article>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id))
      .do((item: Article)=> {
        document.title = `${item.title} - Angular中文社区`;
      });
  }
}
