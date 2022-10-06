import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const ENDPOINT = 'http://localhost:8086';

@Injectable()
export class ApiService {
  private token: string;
  private headers: HttpHeaders;
  private static BaseUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService
  ) {
    this.token = this.cookies.get('x-access-token');
    this.headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    ApiService.BaseUrl = environment.production ? '' : ENDPOINT;
  }

  login(endpoint: string, data: any, options?: any): Observable<any> {
    return this.http.post(`${ApiService.BaseUrl}${endpoint}`, data, options);
  }

  post(endpoint: string, data: any, params?: any): Observable<any> {
    return this.pipeCatchError(() =>
      this.http.post(`${ApiService.BaseUrl}${endpoint}`, data, {
        params,
        headers: this.headers,
      })
    );
  }

  get(endpoint: string, params: any = {}): Observable<any> {
    return this.pipeCatchError(() =>
      this.http.get(`${ApiService.BaseUrl}${endpoint}`, {
        params,
        headers: this.headers,
      })
    );
  }

  getWithId(endpoint: string, id: string): Observable<any> {
    return this.pipeCatchError(() =>
      this.http.get(`${ApiService.BaseUrl}${endpoint}/${id}`, {
        headers: this.headers,
      })
    );
  }

  delete(endpoint: string, id: string): Observable<void> {
    return this.pipeCatchError(() =>
      this.http
        .delete(`${ApiService.BaseUrl}${endpoint}/${id}`, {
          headers: this.headers,
        })
        .pipe(mapTo(null))
    );
  }

  update(endpoint: string, data: any): Observable<any> {
    return this.pipeCatchError(() =>
      this.http.put(`${ApiService.BaseUrl}${endpoint}/${data.id}`, data, {
        headers: this.headers,
      })
    );
  }

  private pipeCatchError(request: () => Observable<any>): Observable<any> {
    return request().pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if ((err as HttpErrorResponse).status === 401) {
            this.router.navigateByUrl('/login');
          }
        } else {
          throw err;
        }
        return EMPTY;
      })
    );
  }
}
