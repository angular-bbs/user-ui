import {Component, OnInit, Input} from '@angular/core';
import {MenuItem} from '../../_shared';

@Component({
  selector: 'author-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ],

})
export class AuthorListComponent implements OnInit {
  constructor() {
  }

  @Input() items: MenuItem[];

  ngOnInit() {
  }

}
