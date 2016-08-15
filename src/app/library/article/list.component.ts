import {Component, Input} from '@angular/core';
import {Article} from '../../_shared';

@Component({
  selector: 'article-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ]
})
export class ArticleListComponent {
  constructor() {
  }

  @Input() items: Article[];
}
