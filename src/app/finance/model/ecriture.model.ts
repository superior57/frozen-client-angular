import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getQueryDateOrDateRange } from 'src/app/common/util';
import { ApiService } from 'src/app/services';
import { EcritureTresorerie } from 'src/app/treasury';
import { Departement } from 'src/app/user';
import { AccountingPeriod } from './accounting-period';
import { Ecriture } from './ecriture';

const ENDPOINT = '/ecritures';

@Injectable()
export class EcritureModel {
  constructor(private api: ApiService) {}

  filter(params: any): Observable<Ecriture[]> {
    return this.api.get(ENDPOINT, params);
  }

  forPeriodAndDepartement(
    period: AccountingPeriod,
    department: Departement
  ): Observable<Ecriture[]> {
    const date = getQueryDateOrDateRange(period);
    return this.filter({
      departement: department.id,
      dateRange: date,
      sort: 'date',
    });
  }

  deleteOne(ecriture: EcritureTresorerie): Observable<void> {
    return this.api.delete(ENDPOINT, `${ecriture.id}`);
  }

  updateOne(ecriture: Ecriture): Observable<Ecriture> {
    return this.api.update(ENDPOINT, ecriture);
  }
}
