import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Column, BasePageComponent, matchById, ColumnApi, MenuItem} from '../../_shared';

@Component({
  selector: 'column-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class ColumnHomeComponent extends BasePageComponent {
  constructor(activatedRoute: ActivatedRoute, private api: ColumnApi) {
    super(activatedRoute);
  }

  items: Observable<MenuItem[]>;

  reload(params: {id: string}) {
    this.items = this.api.query()
      .filter(matchById(params.id))
      .map(columnToMenu)
      .toArray();
  }
}

function columnToMenu(column: Column): MenuItem {
  return {
    icon: column.avatar,
    description: column.bio,
    title: column.name,
    url: `./${column.id}`
  }
}
