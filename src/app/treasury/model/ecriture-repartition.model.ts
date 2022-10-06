import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { EcritureRepartition } from './ecriture-repartition';

const ENDPOINT = '/repartitions/ecritures';

@Injectable()
export class EcritureRepartitionModel {
  constructor(private api: ApiService) {}

  filter(params: any): Observable<EcritureRepartition[]> {
    return this.api.get(ENDPOINT, params);
  }
}
