import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { Reception } from './reception';

const ENDPOINT = '/receptions';

@Injectable()
export class ReceptionModel {
  activeReception$: BehaviorSubject<Reception> = new BehaviorSubject(null);

  constructor(private api: ApiService) {}

  filter(params: any): Observable<Reception[]> {
    return this.api.get(ENDPOINT, params);
  }
}
