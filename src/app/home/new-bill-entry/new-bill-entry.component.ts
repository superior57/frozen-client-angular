import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DepartmentModel, SessionModel } from 'src/app/common/model';
import { Ecriture } from 'src/app/finance/model';
import { Compte, CompteModel } from 'src/app/treasury';

@Component({
  selector: 'app-new-bill-entry',
  templateUrl: './new-bill-entry.component.html',
  styleUrls: ['./new-bill-entry.component.scss'],
})
export class NewBillEntryComponent {
  ecriture: Ecriture;
  comptes$: Observable<Compte[]>;

  constructor(
    private sessionModel: SessionModel,
    private departmentModel: DepartmentModel,
    private dialog: MatDialogRef<NewBillEntryComponent>,
    private comptesModel: CompteModel
  ) {
    const department$ = this.departmentModel.selected$.pipe(filter((d) => !!d));

    const taux$ = this.sessionModel.tauxDeChange$.pipe(filter((t) => !!t));

    combineLatest([department$, taux$]).subscribe(([department, taux]) => {
      this.ecriture = {
        date: new Date(),
        departement: department.id,
        detail: {},
        taux: taux.id,
      };
    });

    this.comptes$ = this.comptesModel.all().pipe(filter((c) => !!c));
  }

  onCancel(): void {
    this.dialog.close();
  }

  onAdd(form: NgForm): void {
    if (form.valid) {
      this.dialog.close({
        ...this.ecriture,
        montant: this.ecriture.montant * -1,
      });
    }
  }
}
