import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bbs-home',
  template: require('./home.component.html'),
  styles: [
    require('./home.component.scss')
  ]
})
export class BbsHomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

}
