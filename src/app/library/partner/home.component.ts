import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PartnerApi, BasePageComponent, Partner, MenuItem} from '../../_shared';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'partner-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class PartnerHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: PartnerApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params): void {
    this.items = this.api.query()
      .map(partnerToMenuItem)
      .toArray();
  }
}

function partnerToMenuItem(partner: Partner): MenuItem {
  return {
    title: partner.name,
    icon: partner.avatar,
    description: partner.description,
    url: `./${partner.id}`
  }
}
