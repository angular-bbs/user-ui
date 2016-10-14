import {Injectable} from '@angular/core';
import {CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Injectable()
export class ChangeTitle implements CanActivateChild {
  constructor(private title: Title) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot) {
    let route: ActivatedRouteSnapshot = childRoute;
    let routes: ActivatedRouteSnapshot[] = [];
    while (route) {
      routes.push(route);
      route = route.parent;
    }
    const title = routes
      .filter(route => route.data && (<any>route.data).title)
      .map(route => (<any>route.data).title)
      .join(' / ');
    this.title.setTitle(title);

    return true;
  }
}
