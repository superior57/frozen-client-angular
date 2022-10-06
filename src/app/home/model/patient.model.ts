import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { Patient } from './patient';

const ENDPOINT = '/patients';

@Injectable()
export class PatientModel {
  patient$: BehaviorSubject<Patient> = new BehaviorSubject<Patient>(null);
  underEdit: Patient = null;

  constructor(private api: ApiService) {}

  updateOne(patient: Patient): Observable<Patient> {
    return this.api.update(ENDPOINT, patient);
  }

  search(params: any): Observable<Patient[]> {
    return this.api.get(ENDPOINT, { ...params });
  }

  create(patient: Patient): Observable<Patient> {
    return this.api.post(ENDPOINT, patient);
  }

  getOne(id: number): Observable<Patient> {
    return this.api.get(`${ENDPOINT}/${id}`);
  }

  filter(params: any): Observable<Patient[]> {
    return this.api.get(ENDPOINT, params);
  }
}
