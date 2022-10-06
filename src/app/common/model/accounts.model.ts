import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Account } from './account';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

const ENDPOINT = '/accounts';

@Injectable()
export class AccountsModel {
  activeAccount$: BehaviorSubject<Account> = new BehaviorSubject(null);

  constructor(private api: ApiService) {}

  setSelectedAccount(account: Account): void {
    this.activeAccount$.next(account);
  }

  getAll(): Observable<Account[]> {
    return this.api.get(ENDPOINT).pipe(
      filter((accounts: Account[]) => !!accounts),
      tap((accounts: Account[]) => this.activeAccount$.next(accounts[0]))
    );
  }

  getStandardAccounts(): Observable<Account[]> {
    return this.api
      .get(ENDPOINT, { compteDeTresorerie: false, compteDeStock: false })
      .pipe(
        filter((accounts: Account[]) => !!accounts),
        tap((accounts: Account[]) => this.activeAccount$.next(accounts[0]))
      );
  }

  getTresorerieAccounts(): Observable<Account[]> {
    return this.api.get(ENDPOINT, { compteDeTresorerie: true }).pipe(
      filter((accounts: Account[]) => !!accounts),
      tap((accounts: Account[]) => this.activeAccount$.next(accounts[0]))
    );
  }

  search(params: any): Observable<Account[]> {
    return this.api.get(ENDPOINT, params);
  }
}
