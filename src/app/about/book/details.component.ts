import {Component, OnInit, Input} from '@angular/core';
import {Book} from '../../_shared';

@Component({
  selector: 'book-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],
})
export class BookDetailsComponent implements OnInit {

  @Input() item: Book;

  constructor() {
  }

  ngOnInit() {
  }

}
