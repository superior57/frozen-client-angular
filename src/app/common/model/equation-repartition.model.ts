import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { EquationRepartition } from './equation-repartition';

const ENDPOINT = '/equations';

@Injectable()
export class EquationRepartitionModel {
  constructor(private api: ApiService) {}

  filter(params): Observable<EquationRepartition[]> {
    return this.api.get(ENDPOINT, params);
  }
}
