import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { Departement, UserModel } from 'src/app/user/model';

const ENDPOINT = '/departements';

@Injectable()
export class DepartmentModel {
  selected$: BehaviorSubject<Departement> = new BehaviorSubject(null);
  list$: BehaviorSubject<Departement[]> = new BehaviorSubject(null);

  constructor(private api: ApiService, userModel: UserModel) {
    userModel.activeUser
      .pipe(
        filter((u) => !!u),
        switchMap((u) => {
          const queryDepartments = u.departements.map((d) => d.departement);
          if (queryDepartments.length > 0) {
            return this.filter({
              id: queryDepartments,
              children: 'equationsRepartitions',
            });
          }

          return of([]);
        })
      )
      .pipe(
        filter((deps) => !!deps && deps.length > 0),
        take(1),
        map((deps) =>
          deps.filter((d) => d.intitule.toLowerCase() !== 'tresorerie')
        )
      )
      .subscribe((departements) => {
        this.list$.next(departements);
        this.selected$.next(
          departements.find((d) => d.intitule === 'HEMODIALYSE') ||
            departements[0]
        );
      });
  }

  filter(params: any): Observable<Departement[]> {
    return this.api.get(ENDPOINT, {
      ...params,
      children: 'equationsRepartitions',
    });
  }
}
