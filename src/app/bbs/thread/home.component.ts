import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ThreadApi, Thread} from '../../_shared';

@Component({
  selector: 'thread-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ],

})
export class ThreadHomeComponent {
  constructor(private activatedRoute: ActivatedRoute, private api: ThreadApi) {
  }

  items: Observable<Thread[]>;

  ngOnInit() {
    const url = this.activatedRoute.snapshot.url[0];
    this.items = this.api.query(url.path)
      .toArray();
  }
}
