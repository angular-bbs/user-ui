import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../_shared';

@Component({
  selector: 'news-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class NewsListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
