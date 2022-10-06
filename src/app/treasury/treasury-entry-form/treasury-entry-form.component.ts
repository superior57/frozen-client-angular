import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/common/error-dialog/error-dialog.component';
import { InfoDialogComponent } from 'src/app/common/info-dialog/info-dialog.component';
import { DepartmentModel } from 'src/app/common/model';
import { Departement, EcritureTresorerieModel } from 'src/app/user';
import { EcritureTresorerie } from '../model';

@Component({
  selector: 'app-treasury-entry-form',
  templateUrl: './treasury-entry-form.component.html',
  styleUrls: ['./treasury-entry-form.component.scss'],
})
export class TreasuryEntryFormComponent {
  private _cdfAmount: number;
  private _usdAmount: number;
  private _departement: string;

  departements$: Observable<Departement[]>;
  ecriture: EcritureTresorerie = { date: new Date() };

  @Output() newEntry: EventEmitter<EcritureTresorerie> = new EventEmitter();

  get cdfAmount(): number {
    return this._cdfAmount;
  }

  set cdfAmount(value: number) {
    if (value && value !== 0) {
      this.usdAmount = 0;
      this.ecriture.devise = 'CDF';
      this.ecriture.montant = value;
    }
    this._cdfAmount = value;
  }

  get usdAmount(): number {
    return this._usdAmount;
  }

  set usdAmount(value: number) {
    if (value && value !== 0) {
      this.cdfAmount = 0;
      this.ecriture.devise = 'USD';
      this.ecriture.montant = value;
    }
    this._usdAmount = value;
  }

  get departement(): string {
    return this._departement;
  }

  set departement(value: string) {
    const departementIdStr = value.substr(0, value.indexOf('::'));
    this._departement = value;
    this.ecriture.libele = value.substr(
      value.indexOf('::') + 2,
      value.length - value.indexOf('::') - 1
    );
    this.ecriture.departement = Number(departementIdStr);
  }

  constructor(
    private departementModel: DepartmentModel,
    private ecritureTresorerieModel: EcritureTresorerieModel,
    private dialog: MatDialog
  ) {
    this.departements$ = this.departementModel.list$.pipe(filter((p) => !!p));
  }

  getDepartementOption(departement: Departement): string {
    if (departement.intitule.toLowerCase() === 'officine') {
      return `Versement - ${departement.label.toLowerCase()}`;
    }

    return `Versement - ${departement.intitule.toLowerCase()}`;
  }

  onSubmit(form: NgForm): boolean {
    if (form.invalid) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: 'Enregistrement invalide.',
        },
      });
      return false;
    }

    this.ecritureTresorerieModel
      .create(this.ecriture)
      .pipe(
        filter((e) => !!e),
        catchError((e) => {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message: 'Enregistrement impossible. Réessayez plus tard.',
            },
          });
          return EMPTY;
        })
      )
      .subscribe((ecriture: EcritureTresorerie) => {
        this.dialog.open(InfoDialogComponent, {
          data: {
            message: 'Enregistrement réussi.',
          },
        });
        this.newEntry.emit(ecriture);
        this.ecriture = { date: new Date() };
        form.reset();
      });
    return true;
  }
}
