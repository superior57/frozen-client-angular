import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services';
import { TreasuryAccount } from './treasury-account';
import { Observable } from 'rxjs';

const ENDPOINT = '/treasury/accounts';

@Injectable()
export class TreasuryAccountModel {
  constructor(private api: ApiService) {}

  getAccounts(): Observable<TreasuryAccount[]> {
    return this.api.get(ENDPOINT);
  }
}
