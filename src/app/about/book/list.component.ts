import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../_shared';

@Component({
  selector: 'book-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class BookListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
