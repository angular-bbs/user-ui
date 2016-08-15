import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../_shared';

@Component({
  selector: 'showcase-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class ShowcaseListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
