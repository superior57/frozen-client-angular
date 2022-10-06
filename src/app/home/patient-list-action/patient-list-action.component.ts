import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from 'ag-grid-community';
import { EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/common/error-dialog/error-dialog.component';
import { MenuModel } from 'src/app/common/model';
import { Patient, PatientModel } from '../model';

@Component({
  selector: 'app-patient-list-action',
  templateUrl: './patient-list-action.component.html',
  styleUrls: ['./patient-list-action.component.scss'],
})
export class PatientListActionComponent implements ICellRendererAngularComp {
  patient: Patient;
  valueChanged: boolean = false;

  constructor(
    private patientModel: PatientModel,
    private route: ActivatedRoute,
    private menuModel: MenuModel,
    private router: Router,
    private dialog: MatDialog
  ) {}

  refresh(params: ICellRendererParams): boolean {
    this.patient = params.data;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.patient = params.data;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onSavePatient(): void {
    this.patientModel
      .updateOne(this.patient)
      .pipe(
        take(1),
        catchError((e) => {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message:
                "Impossible d'enregistrer les changements. Réessayez plus tard.",
            },
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.valueChanged = false;
      });
  }

  onMakeInvoiceClick(): void {
    this.patientModel.patient$.next(this.patient);
    this.patientModel.underEdit = this.patient;

    const url$ = this.route.url.pipe(take(1));
    this.route.url.subscribe((url) => {
      const targetUrl = `/facture/facture?freeQuote=false`;
      const currentUrl = '/' + url.join('/');

      this.menuModel.pushNavigationUrl(currentUrl);
      this.router.navigateByUrl(targetUrl);
    });
  }

  onValueChanged() {
    this.valueChanged = true;
  }
}
