import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { User } from './user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';

const ENDPOINT = '/users';

@Injectable()
export class UserModel {
  activeUser: BehaviorSubject<User> = new BehaviorSubject(null);

  private isCreationMode = true;
  private userUnderEdit: User = new User();

  constructor(
    private api: ApiService,
    private cookies: CookieService,
    private router: Router
  ) {
    const userJson = this.cookies.get('user');
    try {
      const user = JSON.parse(userJson);
      this.activeUser.next(user);
    } catch (e) {
      this.logout();
    }
  }

  getUsers(): Observable<User[]> {
    return this.api.get(ENDPOINT);
  }

  save(user: User, data?: any): Observable<User> {
    return this.isCreationMode
      ? this.createUser(user)
      : this.updateOne(user, data);
  }

  filter(params): Observable<User[]> {
    return this.api.get(ENDPOINT, params);
  }

  deleteOne(user: User): Observable<any> {
    return this.api.delete(ENDPOINT, user.identifiant);
  }

  setUserUnderEdit(user: User): void {
    this.userUnderEdit = user;
  }

  getUserUnderEdit(): User {
    return this.userUnderEdit;
  }

  setIsUserCreationMode(isCreationMode: boolean): void {
    this.isCreationMode = isCreationMode;
  }

  isUserCreationMode(): boolean {
    return this.isCreationMode;
  }

  updateOne(user: User, data?: any): Observable<User> {
    return this.api.update(ENDPOINT, { ...user, id: user.identifiant });
  }

  private createUser(user: User): Observable<User> {
    return this.api.post(ENDPOINT, user);
  }

  logout(): void {
    this.cookies.delete('user');
    this.cookies.delete('x-access-token');
    this.router.navigateByUrl('login');
  }

  userHasRoles(roles: string[]): Observable<boolean> {
    return this.activeUser.pipe(
      filter((u) => !!u),
      map((user) => {
        if (roles.length === 1) {
          return user.roles.find((role) => role.label === roles[0])?.id > -1;
        }

        return roles.some((role) =>
          user.roles.map((role) => role.label).includes(role)
        );
      })
    );
  }

  userHasNotRoles(roles: string[]): Observable<boolean> {
    return this.activeUser.pipe(
      filter((u) => !!u),
      map(
        (user) =>
          !roles.some((role) =>
            user.roles.map((role) => role.label).includes(role)
          )
      )
    );
  }
}
