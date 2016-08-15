import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../models/menu-item';

@Component({
  selector: 'menu-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class MenuListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
