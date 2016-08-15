import {Component} from '@angular/core';
import {BasePageComponent, PartnerApi, Partner, matchById} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'partner-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class PartnerShowComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: PartnerApi) {
    super(activatedRoute);
  }

  item: Observable<Partner>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id));
  }
}
