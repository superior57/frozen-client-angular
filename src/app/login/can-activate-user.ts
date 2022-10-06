import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../services';
import { UserModel } from '../user';

const ENDPOINT = '/users';

@Injectable()
export class CanActivateUser implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private api: ApiService,
    private router: Router,
    private users: UserModel
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userJson = this.cookieService.get('user');

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.users.activeUser.next(user);
        return true;
      } catch (e) {
        this.navigateToLoginScreen();
      }
    }
    this.navigateToLoginScreen();
    return false;
  }

  private navigateToLoginScreen(): void {
    this.router.navigateByUrl('/login');
  }
}
