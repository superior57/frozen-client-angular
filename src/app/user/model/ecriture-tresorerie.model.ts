import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getQueryDateOrDateRange } from 'src/app/common/util';
import { AccountingPeriod, Ecriture } from 'src/app/finance/model';
import { ApiService } from 'src/app/services';
import { EcritureTresorerie } from 'src/app/treasury';
import { Departement } from './departement';

const ENDPOINT = '/tresorerie/ecritures';

@Injectable()
export class EcritureTresorerieModel {
  constructor(private api: ApiService) {}

  create(ecriture: EcritureTresorerie): Observable<EcritureTresorerie> {
    return this.api.post(ENDPOINT, ecriture);
  }

  forPeriodAndDepartment(
    period: AccountingPeriod,
    department: Departement
  ): Observable<EcritureTresorerie[]> {
    const date = getQueryDateOrDateRange(period);
    return this.filter({
      departement: department.id,
      dateRange: date,
      sort: 'date',
    });
  }

  forPeriod(period: AccountingPeriod): Observable<EcritureTresorerie[]> {
    const date = getQueryDateOrDateRange(period);
    return this.filter({ dateRange: date, sort: 'date' });
  }

  filter(params: any): Observable<EcritureTresorerie[]> {
    return this.api.get(ENDPOINT, params);
  }

  deleteOne(ecriture: Ecriture): Observable<void> {
    return this.api.delete(ENDPOINT, `${ecriture.id}`);
  }

  updateOne(ecriture: EcritureTresorerie): Observable<EcritureTresorerie> {
    return this.api.update(ENDPOINT, ecriture);
  }
}
