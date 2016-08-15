import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceApi, BasePageComponent, Article, MenuItem} from '../../_shared';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'resource-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class ResourceHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ResourceApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params): void {
    this.items = this.api.query()
      .map(resourceToMenuItem)
      .toArray();
  }
}

function resourceToMenuItem(resource: Article): MenuItem {
  return {
    title: resource.title,
    icon: resource.image,
    description: resource.summary,
    url: `/library/resource/${resource.id}`
  }
}
