import { Injectable } from '@angular/core';
import { Menu } from './menu';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class MenuModel {
  active$: BehaviorSubject<string> = new BehaviorSubject('');
  shouldDisplayReceptionMenu$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  shouldDisplayPeriodSelector$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  navigationStack: string[] = [];

  constructor(private router: Router) {
    this.active$.next(router.url);
    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url)
      )
      .subscribe((url) => {
        if (url) {
          this.active$.next(url);
        }
      });
    this.active$.subscribe((url) => {
      if (['/finances', '/tresorerie'].includes(url)) {
        this.shouldDisplayPeriodSelector$.next(true);
      } else {
        this.shouldDisplayPeriodSelector$.next(false);
      }
    });
  }

  pushNavigationUrl(url: string): void {
    this.navigationStack.push(url);
  }

  navigateBack(): void {
    if (this.navigationStack.length > 0) {
      const url = this.navigationStack.pop();
      this.router.navigateByUrl(url);
    }
  }

  hasNavigationHistory(): boolean {
    return this.navigationStack.length > 0;
  }
}
