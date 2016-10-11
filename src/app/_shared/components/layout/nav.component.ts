import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-nav',
  template: require('./nav.component.html'),
  styles: [
    require('./nav.component.scss')
  ],

})
export class LayoutNavComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

}
