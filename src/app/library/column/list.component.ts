import {Component, OnInit, Input} from '@angular/core';
import {Column} from '../../_shared';

@Component({
  selector: 'column-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class ColumnListComponent implements OnInit {
  constructor() {
  }

  @Input() items: Column[];

  ngOnInit() {
  }
}
