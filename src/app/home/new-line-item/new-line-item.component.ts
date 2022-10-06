import {
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  DepartmentModel,
  ReceptionModel,
  SessionModel,
} from 'src/app/common/model';
import { AccountEntry, Ecriture } from 'src/app/finance/model';
import { Departement } from 'src/app/user';

@Component({
  selector: 'app-new-line-item',
  templateUrl: './new-line-item.component.html',
  styleUrls: ['./new-line-item.component.scss'],
})
export class NewLineItemComponent {
  ecriture: Ecriture;
  departement$: Observable<Departement>;
  isEditMode: boolean = false;

  @Output() newEntry: EventEmitter<AccountEntry> = new EventEmitter();

  constructor(
    departmentModel: DepartmentModel,
    private sessionModel: SessionModel,
    private dialog: MatDialogRef<NewLineItemComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.departement$ = departmentModel.selected$.pipe(filter((d) => !!d));
    this.departement$.subscribe((d) => this.resetEntry(d.id));
  }

  private resetEntry(departementId: number = undefined): void {
    if (this.data?.ecriture) {
      this.ecriture = this.data.ecriture;
      this.isEditMode = true;
    } else {
      this.ecriture = {
        id: undefined,
        date: new Date(),
        departement: departementId,
        detail: null,
        details: null,
        devise: null,
        ecrituresRepartitions: null,
        libele: null,
        montant: null,
        piece: null,
        taux: null,
        tauxDeChange: null,
      };
    }
  }

  submitEntry(form: NgForm): void {
    if (!form.invalid) {
      this.sessionModel.tauxDeChange$
        .pipe(filter((e) => !!e))
        .subscribe((taux) => {
          this.ecriture.taux = taux.id;
          this.dialog.close(this.ecriture);
          this.resetEntry(this.ecriture.departement);
          form.resetForm();
        });
    }
  }

  onCancel(): void {
    this.resetEntry(null);
    this.dialog.close(null);
  }
}
