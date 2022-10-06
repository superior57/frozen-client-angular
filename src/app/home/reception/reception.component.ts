import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import {
  DepartmentModel,
  MenuModel,
  ReceptionModel,
} from 'src/app/common/model';
import { Departement, UserModel } from 'src/app/user';
import { NewPatientComponent } from '../new-patient/new-patient.component';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss'],
})
export class ReceptionComponent {
  department$: Observable<Departement>;

  constructor(
    private departmentModel: DepartmentModel,
    private receptionModel: ReceptionModel,
    private router: Router,
    private route: ActivatedRoute,
    private menuModel: MenuModel,
    private dialog: MatDialog,
    public userModel: UserModel
  ) {
    this.department$ = departmentModel.selected$.pipe(filter((d) => !!d));
  }

  isFrequoteEnabledReception(): Observable<boolean> {
    return this.departmentModel.selected$.pipe(
      filter((d) => !!d),
      map(
        (d) =>
          d.intitule.toLowerCase() === 'laboratoire' ||
          d.intitule.toLowerCase() === 'sang'
      )
    );
  }

  onNewQuoteClick(isFreeQuote: boolean = false): void {
    const departement$ = this.departmentModel.selected$.pipe(
      filter((d) => !!d)
    );
    combineLatest([departement$, this.route.url]).subscribe(
      ([departement, url]) => {
        const targetUrl = `/facture/facture?freeQuote=${isFreeQuote}&departmentId=${departement.id}`;
        const currentUrl = '/' + url.join('/');

        this.menuModel.pushNavigationUrl(currentUrl);
        this.router.navigateByUrl(targetUrl);
      }
    );
  }

  onPatientListClick(): void {
    this.route.url.subscribe((url) => {
      const targetUrl = `/patients`;
      const currentUrl = '/' + url.join('/');

      this.menuModel.pushNavigationUrl(currentUrl);
      this.router.navigateByUrl(targetUrl);
    });
  }

  onNewPatientClick(): void {
    this.dialog.open(NewPatientComponent);
  }

  userHasRequiredPermissions(): Observable<boolean> {
    return combineLatest([
      this.userModel.userHasRoles(['admin', 'chef-departement', 'encodeur']),
      this.userModel.userHasNotRoles(['partenaire']),
    ]).pipe(
      map(
        ([hasRequiredRoles, missesRestrictedRoles]) =>
          hasRequiredRoles && missesRestrictedRoles
      )
    );
  }

  onNewBillClick(): void {
    this.route.url.subscribe((url) => {
      const currentUrl = '/' + url.join('/');
      const destinationurl = '/facture/bon?freeQuote=false';

      this.router.navigateByUrl(destinationurl);
      this.menuModel.pushNavigationUrl(currentUrl);
    });
  }

  isRecommandedEnabled(): Observable<boolean> {
    return combineLatest([
      this.isFrequoteEnabledReception(),
      this.userHasRequiredPermissions(),
    ]).pipe(map(([enabled, allowed]) => enabled && allowed));
  }

  onNewConsultationClick(): void {
    this.route.url.subscribe((url) => {
      const currentUrl = '/' + url.join('/');
      const destinationUrl = '/consultation';

      this.router.navigateByUrl(destinationUrl);
      this.menuModel.pushNavigationUrl(currentUrl);
    });
  }
}
