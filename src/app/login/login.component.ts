import { Component } from '@angular/core';
import { ApiService } from '../services';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UserModel, User } from '../user';
import { take, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

const ENDPOINT = '/auth/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginFailure = false;

  constructor(
    private api: ApiService,
    private cookieService: CookieService,
    private router: Router,
    private user: UserModel,
    private snackBar: MatSnackBar
  ) {}

  login(username: string, password: string): void {
    this.loginFailure = false;

    if (!!username && !!password) {
      this.loginFailure = false;
      this.api
        .login(
          ENDPOINT,
          { utilisateur: username, password },
          { observe: 'response' }
        )
        .pipe(
          take(1),
          catchError((err) => {
            if (
              err instanceof HttpErrorResponse &&
              (err as HttpErrorResponse).status === 400
            ) {
              this.loginFailure = true;
            } else {
              this.snackBar.open(
                'Connexion impossible, réessayez plus tard.',
                'Ignorer'
              );
            }
            return EMPTY;
          })
        )
        .subscribe((response: HttpResponse<User>) => {
          const user = response.body;
          const token =
            response.headers.get('x-access-token') || (user as any).token;
          this.cookieService.set('x-access-token', token);
          this.cookieService.set('user', JSON.stringify(user));
          this.user.activeUser.next(user);
          this.router.navigateByUrl('splash');
        });
    }
  }
}
