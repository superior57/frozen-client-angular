import { AfterViewInit, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import PerfectScrollbar from 'perfect-scrollbar';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { DocumentPreviewComponent } from 'src/app/common/document-preview/document-preview.component';
import { DepartmentModel } from 'src/app/common/model';
import { AccountEntryModel, AccountingPeriodType } from 'src/app/finance/model';
import { UserModel } from 'src/app/user';
import { Document, DocumentModel, DocumentType, Patient } from '../model';

@Component({
  selector: 'app-latest-data',
  templateUrl: './latest-data.component.html',
  styleUrls: ['./latest-data.component.scss'],
})
export class LatestDataComponent {
  quotes$: Observable<Document[]>;

  readonly displayedColumns: string[] = ['date', 'patientId', 'total'];

  constructor(
    private dialog: MatDialog,
    private documentModel: DocumentModel,
    private departementModel: DepartmentModel,
    private periodModel: AccountEntryModel,
    public userModel: UserModel
  ) {
    const departement$ = departementModel.selected$.pipe(filter((d) => !!d));

    this.quotes$ = departement$.pipe(
      switchMap((departement) => {
        return this.documentModel
          .filter({
            type: DocumentType.FACTURE,
            count: 5,
            departement: departement.id,
            sort: '-date',
          })
          .pipe(filter((q) => !!q && q.length > 0));
      })
    );

    const date: Date = new Date();
    this.periodModel.period$.next({
      selectedDate: date,
      selectedMonth: date.getMonth(),
      selectedYear: date.getFullYear(),
      type: AccountingPeriodType.Journalier,
    });
  }

  getQuoteTotal(quote: Document): string {
    return (
      (quote?.lignes.length > 0
        ? quote.lignes.map((e) => e.montant).reduce((p, c) => p + c)
        : 0
      ).toFixed(2) + ` $US`
    );
  }

  getPatientFullName(patient: Patient): string {
    let fullName =
      patient?.nom && patient?.nom != null && patient?.nom !== '0'
        ? patient?.nom
        : '';
    fullName +=
      ' ' + patient?.postnom &&
      patient?.postnom != null &&
      patient?.postnom !== '0'
        ? patient?.postnom
        : '';
    fullName +=
      ' ' + patient?.prenom &&
      patient?.prenom != null &&
      patient?.prenom !== '0'
        ? patient?.prenom
        : '';
    return fullName;
  }

  getPatientAvatarFromGender(patient: Patient): string {
    if (patient?.sexe === 'F') {
      return 'icons8-woman-64.png';
    } else {
      return 'icons8-standing-man-64.png';
    }
  }

  getQuoteAvatarFromDiscountType(quote: Document): string {
    if (quote.gratuit) {
      return 'icons8-delete-dollar-64.png';
    } else {
      return 'icons8-check-dollar-64.png';
    }
  }

  onQuotePreview(quote: Document): void {
    this.dialog.open(DocumentPreviewComponent, {
      data: { document: quote },
    });
  }

  onPatientPreview(patient: Patient): void {}
}
