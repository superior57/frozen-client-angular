import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';

@Injectable()
export class StatsModel {
  timeline$: Observable<any[]>;
  income$: Observable<any[]>;
  invsout$: Observable<any[]>;
  labovsloss$: Observable<any[]>;

  constructor(private api: ApiService) {
    this.timeline$ = this.api.get('/stats/timeline');
    this.income$ = this.api.get('/stats/income');
    this.invsout$ = this.api.get('/stats/invsout');
    this.labovsloss$ = this.api.get('/stats/labovsloss');
  }
}
