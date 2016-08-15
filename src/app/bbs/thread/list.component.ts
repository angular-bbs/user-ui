import {Component, OnInit, Input} from '@angular/core';
import {Thread} from '../../_shared';

@Component({
  selector: 'thread-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss'
  ]
})
export class ThreadListComponent implements OnInit {
  constructor() {
  }

  @Input() items: Thread[];

  ngOnInit() {
  }

}
