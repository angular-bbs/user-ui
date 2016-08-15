import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'thread-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.scss'
  ]
})
export class ThreadCreateComponent implements OnInit {
  constructor(private http: Http) {
  }

  ngOnInit() {
  }

}
