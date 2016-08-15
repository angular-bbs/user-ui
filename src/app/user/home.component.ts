import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Auth} from '../_shared';
import {Http} from '@angular/http';

@Component({
  selector: 'user-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ]
})
export class UserHomeComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: Auth, private http: Http) {
  }

  name: string;

  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe((params: {code: string, state: string})=> {
      const state = params.state;
      const code = params.code;
      if (!state && !code) {
        return this.router.navigate(['/bbs']);
      }
      if (decodeURIComponent(state) !== this.auth.csrfToken) {
        alert('安全码不匹配，请联系管理员！');
      } else {
        this.http.post('/api/github/user', {
          state: state,
          code: code,
          redirect_url: this.router.serializeUrl(this.router.createUrlTree(['/bbs/user/home']))
        }).subscribe((data)=> {
          this.name = data.json().name;
        }, (err)=> {
          console.error(err);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
