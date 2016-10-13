import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';

@Injectable()
export class ChangeTitle implements CanActivateChild {
  canActivateChild(childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let route: ActivatedRouteSnapshot = childRoute;
    let routes: ActivatedRouteSnapshot[] = [];
    while (route) {
      routes.push(route);
      route = route.parent;
    }
    document.title = routes
      .filter(route => route.data && (<any>route.data).title)
      .map(route => (<any>route.data).title)
      .join(' / ');
    return true;
  }
}
