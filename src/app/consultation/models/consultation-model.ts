import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { Consultation } from './consultation';

const ConsultationEndpoint = '/consultations';

@Injectable()
export class ConsultationsModel {
  active$: BehaviorSubject<Consultation>;

  constructor(private api: ApiService) {
    this.resetActive();
  }

  create(): Observable<Consultation> {
    return this.api
      .post(ConsultationEndpoint, this.active$.value);
  }

  update(): Observable<Consultation> {
    return this.api
      .update(`${ConsultationEndpoint}/${this.active$.value.id}`, this.active$.value);
  }

  resetActive(): void {
    this.active$ = new BehaviorSubject({ 
      date: new Date().toLocaleDateString('fr'),
      description: '',
      patient: null,
      medecin: null,
      departement: null,
      notes: '',
      SignesVitaux: {
        symptomes: '',
        tension: '',
        imc: '',
        date: new Date().toLocaleDateString('fr'),
      }
    });
  }
}
