import {Component, OnInit, Input} from '@angular/core';
import {Article} from '../../_shared';

@Component({
  selector: 'article-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],

})
export class ArticleDetailsComponent implements OnInit {
  @Input() item: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
