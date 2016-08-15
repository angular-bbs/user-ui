import {Component, OnInit, Input} from '@angular/core';
import {Thread} from '../../_shared';

@Component({
  selector: 'thread-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],


})
export class ThreadDetailsComponent implements OnInit {
  @Input() item: Thread;

  constructor() {
  }

  ngOnInit() {
  }
}
