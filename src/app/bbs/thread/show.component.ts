import { Component } from '@angular/core';
import { ThreadApi, Thread, BasePageComponent, matchById } from '../../_shared';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'thread-show',
  templateUrl: './show.component.html',
  styleUrls: [
    './show.component.scss'
  ],

})
export class ThreadShowComponent extends BasePageComponent {
  constructor(private api: ThreadApi, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  item: Observable<Thread>;

  reload(params: { id: string }) {
    this.item = this.api.query('')
      .find(matchById(params.id))
      .do((item: Thread) => {
        document.title = `${item.title} - Angular中文社区`;
      });
  }
}
