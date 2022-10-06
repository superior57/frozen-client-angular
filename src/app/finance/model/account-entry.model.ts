import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AccountEntry, AccountEntryType } from './account-entry';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AccountingPeriod } from './accounting-period';
import { AccountingPeriodType } from './accounting-period-type';
import { Account } from 'src/app/common/model/account';
import { AccountsModel } from 'src/app/common/model/accounts.model';
import {
  getFirstDateOfMonth,
  getLastDayOfMonth,
} from 'src/app/common/util/date.util';

const ENDPOINT = '/logEntries';
const DATE_LOCALE = 'en-US';

@Injectable()
export class AccountEntryModel {
  constructor(private api: ApiService, private accounts: AccountsModel) {
    this.entries$ = this.queryAccountEntiresForActivePeriod();
  }
  period$: BehaviorSubject<AccountingPeriod> = new BehaviorSubject(null);
  entries$: Observable<AccountEntry[]>;

  public static calculateTotalAmount(
    entries$: Observable<AccountEntry[]>
  ): Observable<number> {
    return entries$.pipe(
      map((entries: AccountEntry[]) => {
        const entriesWithTotalPrice = entries.map((entry: AccountEntry) => {
          const price = entry.prixTotal;
          return entry.type === AccountEntryType.SORTIE ? price * -1 : price;
        });
        return entriesWithTotalPrice.length > 0
          ? entriesWithTotalPrice.reduce(
              (previous: number, current: number) => previous + current
            )
          : 0;
      })
    );
  }

  setPeriod(period: AccountingPeriod): void {
    this.period$.next(period);
  }

  getEntriesForAccountOnActivePeriod(
    account: Account
  ): Observable<AccountEntry[]> {
    return this.period$.pipe(
      filter((period: AccountingPeriod) => !!period),
      switchMap((period: AccountingPeriod) => {
        const date: string | string[] = this.getQueryDate(period);
        return this.queryAccountEntries(account, date);
      })
    );
  }

  private queryAccountEntiresForActivePeriod(): Observable<AccountEntry[]> {
    return combineLatest([this.period$, this.accounts.activeAccount$]).pipe(
      filter(([period, activeAccount]) => !!period && !!activeAccount),
      switchMap(([period, activeAccount]) => {
        const date: string | string[] = this.getQueryDate(period);
        return this.queryAccountEntries(activeAccount, date);
      })
    );
  }

  private getQueryDate(period: AccountingPeriod): string | string[] {
    if (period.type === AccountingPeriodType.Journalier) {
      return period.selectedDate.toLocaleDateString(DATE_LOCALE);
    } else if (period.type === AccountingPeriodType.Mensuel) {
      return [
        getFirstDateOfMonth(
          period.selectedMonth,
          period.selectedYear
        ).toLocaleDateString(DATE_LOCALE),
        getLastDayOfMonth(
          period.selectedMonth,
          period.selectedYear
        ).toLocaleDateString(DATE_LOCALE),
      ];
    } else if (period.type === AccountingPeriodType.Annuel) {
      return [
        getFirstDateOfMonth(1, period.selectedYear).toLocaleDateString(
          DATE_LOCALE
        ),
        getLastDayOfMonth(12, period.selectedYear).toLocaleDateString(
          DATE_LOCALE
        ),
      ];
    }
  }

  private queryAccountEntries(
    activeAccount: Account,
    date: any
  ): Observable<AccountEntry[]> {
    const params: {} = this.getHttpParams(activeAccount?.id, date);

    return this.api.get(ENDPOINT, { ...params, sort: 'date' }).pipe(
      map((entries: AccountEntry[]) => {
        return entries.map((entry: AccountEntry) => {
          return {
            ...entry,
            prixTotal: this.calculateTotalPrice(entry),
          };
        });
      })
    );
  }

  private getHttpParams(accountId: number, date: any): any {
    const params: any = {};
    if (accountId) {
      params.accountId = accountId;
    }

    if (date.length === 2) {
      params.dateRange = date;
    } else {
      params.date = date;
    }

    return params;
  }

  private calculateTotalPrice(entry: AccountEntry): number {
    if (entry.type === AccountEntryType.SORTIE) {
      return entry.quantite === 0
        ? entry.prixUnitaire
        : entry.prixUnitaire * entry.quantite;
    }
    return entry.prixUnitaire;
  }

  create(
    data: AccountEntry | AccountEntry[]
  ): Observable<AccountEntry> | Observable<AccountEntry[]> {
    return this.api.post(ENDPOINT, data);
  }
}
