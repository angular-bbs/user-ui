import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { StringMap } from '../../utils/index';

@Component({ template: '' })
export abstract class BasePageComponent implements OnInit, OnDestroy {
  constructor(protected activatedRoute: ActivatedRoute) {
  }

  activatedRouteSubscription: Subscription;

  ngOnInit() {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params) => {
      this.reload(params);
    });
  }

  ngOnDestroy() {
    this.activatedRouteSubscription.unsubscribe();
  }

  abstract reload(params: StringMap): void;
}
