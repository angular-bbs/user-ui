import {Component, OnInit, Input} from '@angular/core';
import {Column} from '../../_shared';

@Component({
  selector: 'column-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],


})
export class ColumnDetailsComponent implements OnInit {
  constructor() {
  }

  @Input() item: Column;

  ngOnInit() {
  }

}
