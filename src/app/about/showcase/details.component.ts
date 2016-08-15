import {Component, OnInit, Input} from '@angular/core';
import {Showcase} from '../../_shared';

@Component({
  selector: 'showcase-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],


})
export class ShowcaseDetailsComponent implements OnInit {

  @Input() item: Showcase;

  constructor() {
  }

  ngOnInit() {
  }

}
