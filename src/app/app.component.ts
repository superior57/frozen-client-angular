import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ConnectionModel, DepartmentModel, MenuModel } from './common/model';
import { Departement, UserModel } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'EMSS';
  isLoginMode: Observable<boolean>;
  departements$: Observable<Departement[]>;

  constructor(
    public router: Router,
    public connection: ConnectionModel,
    public userModel: UserModel,
    public menuModel: MenuModel,
    public departementModel: DepartmentModel,
    private route: ActivatedRoute
  ) {
    this.departements$ = departementModel.list$.pipe(filter((d) => !!d));
    this.isLoginMode = router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/login')
    );
  }

  openDepartment(department: Departement): void {
    this.departementModel.selected$.next(department);
    const url = this.route.url.subscribe((url) => {
      const currentUrl = url.join('/');
      const targetUrl = 'reception';

      this.menuModel.pushNavigationUrl('/' + currentUrl);
      this.router.navigateByUrl(targetUrl);
    });
  }

  isRouteEqualTo(routes: string[]): Observable<boolean> {
    return this.menuModel.active$.pipe(
      map((url) => {
        return routes.includes(url);
      })
    );
  }

  logoutUser(): void {
    this.userModel.logout();
  }
}
