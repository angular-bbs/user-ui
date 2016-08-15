import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../_shared';

@Component({
  selector: 'resource-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class ResourceListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
