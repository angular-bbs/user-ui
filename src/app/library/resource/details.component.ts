import {Component, OnInit, Input} from '@angular/core';
import {Article} from '../../_shared';

@Component({
  selector: 'resource-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ]
})
export class ResourceDetailsComponent implements OnInit {

  @Input() item: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
