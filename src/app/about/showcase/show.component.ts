import {Component} from '@angular/core';
import {BasePageComponent, ShowcaseApi, Showcase, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'showcase-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class ShowcaseShowComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ShowcaseApi) {
    super(activatedRoute);
  }

  item: Observable<Showcase>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id));
  }
}
