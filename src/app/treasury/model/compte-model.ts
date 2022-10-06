import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getQueryDateOrDateRange } from 'src/app/common';
import { EquationRepartition } from 'src/app/common/model';
import { AccountingPeriod } from 'src/app/finance/model';
import { ApiService } from 'src/app/services';
import { Departement } from 'src/app/user';
import { Compte } from './compte';

const ENDPOINT = '/comptes';

@Injectable()
export class CompteModel {
  constructor(private api: ApiService) {}

  all(): Observable<Compte[]> {
    return this.api.get(ENDPOINT);
  }

  recalculate(
    period: AccountingPeriod,
    department: Departement,
    equation: EquationRepartition
  ): Observable<{ status: string }> {
    const dateRange = getQueryDateOrDateRange(period);
    return this.api.post(
      `/recalculate`,
      { ...department, equation },
      { dateRange: dateRange }
    );
  }
}
