import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { User } from 'src/app/user';
import { Patient } from './patient';

const ENDPOINT = '/agents';

@Injectable()
export class AgentModel {
  constructor(private api: ApiService) {}

  search(params: any): Observable<Patient[]> {
    return this.api.get(ENDPOINT, { ...params });
  }
}
