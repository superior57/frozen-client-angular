import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { Quote } from './quote';

const ENDPOINT = '/quotes';

@Injectable()
export class QuoteModel {
  currentQuote: Quote;

  constructor(private api: ApiService) {
    this.resetCurrentQuote();
  }

  private resetCurrentQuote(): void {
    this.currentQuote = { date: new Date(), logEntries: [] };
  }

  saveCurrentQuote(): Observable<Quote> {
    return this.api
      .post(ENDPOINT, this.currentQuote)
      .pipe(tap(() => this.resetCurrentQuote()));
  }

  filter(params: any): Observable<Quote[]> {
    return this.api.get(ENDPOINT, params);
  }
}
