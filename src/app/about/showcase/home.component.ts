import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShowcaseApi, BasePageComponent, Showcase, MenuItem} from '../../_shared';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'showcase-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class ShowcaseHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ShowcaseApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params): void {
    this.items = this.api.query()
      .map(showcaseToMenuItem)
      .toArray();
  }
}

function showcaseToMenuItem(showcase: Showcase): MenuItem {
  return {
    title: showcase.title,
    icon: showcase.picture,
    description: `${[showcase.customer, showcase.author].join('&')}`,
    url: `/about/showcase/${showcase.id}`
  }
}
