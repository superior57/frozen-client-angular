import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { AccountDispatchSetting } from './account-disatch-setting';
import { AccountsModel } from 'src/app/common/model';
import {
  AccountEntryModel,
  AccountingPeriodType,
  AccountEntry,
  AccountEntryType,
  AccountingPeriod,
} from 'src/app/finance/model';
import {
  calculateDispatches,
  AccountDispatchCalculationResult,
} from './dispatch-calculator';
import { TreasuryAccountModel } from './treasury-account.model';

const ENDPOINT = '/dispatches';

@Injectable()
export class AccountDispatchSettingModel {
  constructor(
    private api: ApiService,
    private accounts: AccountsModel,
    private accountEntries: AccountEntryModel,
    private treasuryAccounts: TreasuryAccountModel
  ) {}

  static tryParseDispatchPeriod(period: AccountingPeriod): string {
    if (period.type === AccountingPeriodType.Mensuel) {
      return `${period.selectedYear}/${period.selectedMonth + 1}/1`;
    } else {
      throw new Error(
        'This operation is only available for monthly period types'
      );
    }
  }

  getDispatchSettings(): Observable<AccountDispatchSetting[]> {
    return this.api
      .get(ENDPOINT, { orderBy: 'dateDebut' })
      .pipe(map((dispatches: any) => dispatches as AccountDispatchSetting[]));
  }

  getDispatchSettingsForAccount(
    accountId: number,
    periodDate: string
  ): Observable<AccountDispatchSetting[]> {
    return this.api
      .get(ENDPOINT, {
        accountId,
        sort: '-dateDebut',
        date: periodDate,
        count: 1,
      })
      .pipe(map((dispatches: any) => dispatches as AccountDispatchSetting[]));
  }

  getDispatchesForActivePeriod(
    accountId?: number
  ): Observable<AccountDispatchSetting[]> {
    if (accountId) {
      return this.getDispatchesForStaticActiveAccount(accountId);
    }
    return this.getDispatchesForObservedActiveAccount();
  }

  getDispatchesForStaticActiveAccount(
    accountId: number
  ): Observable<AccountDispatchSetting[]> {
    return this.accountEntries.period$.pipe(
      filter((period: AccountingPeriod) => !!period),
      switchMap((period: AccountingPeriod) => {
        const date = AccountDispatchSettingModel.tryParseDispatchPeriod(period);
        return this.getDispatchSettingsForAccount(accountId, date);
      })
    );
  }

  private getDispatchesForObservedActiveAccount(): Observable<
    AccountDispatchSetting[]
  > {
    return combineLatest([
      this.accounts.activeAccount$,
      this.accountEntries.period$,
    ]).pipe(
      filter(([account, period]) => !!account && !!period),
      switchMap(([account, period]) => {
        const date = AccountDispatchSettingModel.tryParseDispatchPeriod(period);
        return this.getDispatchSettingsForAccount(account.id, date);
      })
    );
  }

  calculateDispatchAmounts(
    dispatches$: Observable<AccountDispatchSetting[]>,
    entries$: Observable<AccountEntry[]>
  ): Observable<AccountDispatchCalculationResult[]> {
    const treasuryAccounts$ = this.treasuryAccounts.getAccounts();

    return combineLatest([dispatches$, entries$, treasuryAccounts$]).pipe(
      filter(
        ([dispatches, entries]) =>
          !!dispatches &&
          !!entries &&
          dispatches.length > 0 &&
          entries.length > 0
      ),
      map(([dispatches, entries, accounts]) => {
        const calculatedDispatches = calculateDispatches(
          dispatches[0],
          entries,
          accounts
        ).map(
          (result: AccountDispatchCalculationResult) =>
            (({
              ...result,
              amount: result.amount,
            } as unknown) as AccountDispatchCalculationResult)
        );

        const total = entries
          .filter(
            (entry: AccountEntry) => entry.type !== AccountEntryType.SORTIE
          )
          .map((entry: AccountEntry) => entry.prixTotal)
          .reduce((previous: number, current: number) => previous + current);

        calculatedDispatches.push({
          amount: Number(total),
          label: 'Total',
          portion: 100,
          type: 'Total',
        });
        return calculatedDispatches;
      })
    );
  }

  filterCalculationResult(
    results: AccountDispatchCalculationResult[]
  ): AccountDispatchCalculationResult[] {
    const returnValue = [];

    results.forEach((result: AccountDispatchCalculationResult) => {
      if (result.label !== 'Total') {
        if (result.children) {
          returnValue.push(...this.filterCalculationResult(result.children));
        } else {
          returnValue.push(result);
        }
      }
    });
    return returnValue;
  }
}
