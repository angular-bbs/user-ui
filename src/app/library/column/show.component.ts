import {Component} from '@angular/core';
import {BasePageComponent, Column, matchById, ColumnApi} from '../../_shared';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'column-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class ColumnShowComponent extends BasePageComponent {
  constructor(activateRoute: ActivatedRoute, private api: ColumnApi) {
    super(activateRoute);
  }

  item: Observable<Column>;

  reload(params: {id: string}): void {
    this.item = this.api.query()
      .find(matchById(params.id));
  }
}
