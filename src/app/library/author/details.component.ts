import {Component, OnInit, Input} from '@angular/core';
import {Author} from '../../_shared';

@Component({
  selector: 'author-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],


})
export class AuthorDetailsComponent implements OnInit {

  @Input() item: Author;

  constructor() {
  }

  ngOnInit() {
  }
}
