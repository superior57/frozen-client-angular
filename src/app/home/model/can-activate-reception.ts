import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ReceptionModel } from 'src/app/common/model';

@Injectable()
export class CanActivateReception implements CanActivate {
  constructor(private receptionModel: ReceptionModel, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.receptionModel.activeReception$.pipe(
      map((reception) => !!reception),
      tap((receptionNotNull) => {
        if (!receptionNotNull) {
          this.router.navigateByUrl('/acceuil');
        }
      })
    );
  }
}
