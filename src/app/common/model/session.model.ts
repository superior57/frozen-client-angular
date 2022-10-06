import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TauxDeChange } from 'src/app/finance/model';
import { ApiService } from 'src/app/services';

const ENDPOINT = '/taux';

@Injectable()
export class SessionModel {
  tauxDeChange$: BehaviorSubject<TauxDeChange> = new BehaviorSubject(null);

  constructor(private api: ApiService) {
    this.api
      .get(ENDPOINT, { sort: 'date', count: 1, lowerDateBound: new Date() })
      .pipe(
        filter((er) => !!er),
        map((er) => er[0])
      )
      .subscribe((taux) => this.tauxDeChange$.next(taux));
  }
}
