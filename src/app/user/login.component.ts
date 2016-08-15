import {Component, OnInit} from '@angular/core';
import {Auth} from '../_shared';

@Component({
  selector: 'user-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss'
  ]
})
export class UserLoginComponent implements OnInit {
  constructor(private auth: Auth) {
  }

  ngOnInit() {
  }

}
