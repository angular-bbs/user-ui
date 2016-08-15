import {Component, OnInit, Input} from '@angular/core';
import {Article} from '../../_shared';

@Component({
  selector: 'news-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],

})
export class NewsDetailsComponent implements OnInit {

  @Input() item: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
