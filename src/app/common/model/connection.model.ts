import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services';

const ENDPOINT = '/ping';

@Injectable()
export class ConnectionModel {
  private ping: () => void;

  connected$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private api: ApiService) {
    this.ping = () => {
      this.api
        .get(ENDPOINT)
        .pipe(
          catchError(() => {
            this.connected$.next(false);
            this.runPing();
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.connected$.next(true);
          this.runPing();
        });
    };

    this.ping();
  }

  runPing(): void {
    setTimeout(() => this.ping(), 5000);
  }
}
