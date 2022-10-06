import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { Document } from './document';

const ENDPOINT = '/documents';

@Injectable()
export class DocumentModel {
  active$: BehaviorSubject<Document> = new BehaviorSubject(null);
  underEdit: Document = null;

  constructor(private api: ApiService) {}

  filter(params: any): Observable<Document[]> {
    return this.api.get(ENDPOINT, params);
  }

  save(document: Document): Observable<Document> {
    return this.api.post(ENDPOINT, document);
  }
}
