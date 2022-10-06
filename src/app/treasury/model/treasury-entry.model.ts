import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services';
import { TreasuryEntry } from './treasury-entry';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { getFirstDateOfMonth, getLastDayOfMonth } from 'src/app/common';
import {
  AccountingPeriod,
  AccountingPeriodType,
  AccountEntryModel,
} from 'src/app/finance/model';

const ENDPOINT = '/treasury/entries';
const DATE_LOCALE = 'en-US';

@Injectable()
export class TreasuryEntryModel {
  constructor(
    private api: ApiService,
    private accountEntryModel: AccountEntryModel
  ) {}

  getEntries(): Observable<TreasuryEntry[]> {
    return this.queryTreasuryEntiresForActivePeriod().pipe(
      map((entries: any[]) => entries as TreasuryEntry[])
    );
  }

  private queryTreasuryEntiresForActivePeriod(): Observable<TreasuryEntry[]> {
    return this.accountEntryModel.period$.pipe(
      filter((period) => !!period),
      switchMap((period) => {
        const date: string | string[] = this.getQueryDate(period);
        return this.queryTreasuryEntries(date);
      })
    );
  }

  private queryTreasuryEntries(date: any): Observable<TreasuryEntry[]> {
    const params: {} = this.getHttpParams(date);

    return this.api.get(ENDPOINT, { ...params, sort: 'date' });
  }

  private getHttpParams(date: any): any {
    const params: any = {};
    if (date.length === 2) {
      params.dateRange = date;
    } else {
      params.date = date;
    }

    return params;
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
}
