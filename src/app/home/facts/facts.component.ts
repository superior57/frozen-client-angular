import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { getFirstDateOfMonth, getLastDayOfMonth } from 'src/app/common';
import { DepartmentModel, SessionModel } from 'src/app/common/model';
import { TauxDeChange } from 'src/app/finance/model';
import { Departement, UserModel } from 'src/app/user';
import { Document, DocumentModel, DocumentType, Patient } from '../model';

@Component({
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss'],
})
export class FactsComponent {
  quotes$: Observable<Document[]>;
  patients$: Observable<Patient[]>;
  total$: Observable<number>;
  departement$: Observable<Departement>;

  constructor(
    public userModel: UserModel,
    private documentModel: DocumentModel,
    private sessionModel: SessionModel,
    private departementModel: DepartmentModel
  ) {
    this.departement$ = departementModel.selected$.pipe(filter((d) => !!d));

    const currentDate = new Date();
    this.quotes$ = this.departement$.pipe(
      switchMap((departement) => {
        return this.documentModel.filter({
          type: DocumentType.FACTURE,
          dateRange: [
            getFirstDateOfMonth(
              currentDate.getMonth(),
              currentDate.getFullYear()
            ),
            getLastDayOfMonth(
              currentDate.getMonth(),
              currentDate.getFullYear()
            ),
          ],
          departement: departement?.id,
        });
      })
    );
    this.patients$ = this.quotes$.pipe(
      map((quotes) => quotes.map((quote) => quote.client))
    );

    this.total$ = this.quotes$.pipe(
      switchMap((quotes) => this.getQuotesTotal(quotes))
    );
  }

  private getQuotesTotal(quotes: Document[]): Observable<number> {
    return this.sessionModel.tauxDeChange$.pipe(
      filter((t) => !!t),
      map((taux) => {
        const values = quotes.map((q) => this.getQuoteTotal(q, taux));
        return values.length > 0 ? values.reduce((c, p) => p + c) : 0;
      })
    );
  }

  private getQuoteTotal(
    document: Document,
    tauxDeChange: TauxDeChange
  ): number {
    return document.lignes?.length > 0
      ? document.lignes
          .map((l) =>
            l.devise === 'CDF' ? l.montant / tauxDeChange.taux : l.montant
          )
          .reduce((p, c) => p + c)
      : 0;
  }

  userHasRequiredRoles(): Observable<boolean> {
    return this.userModel.userHasRoles([
      'admin',
      'tresorerier',
      'gen:01',
      'gen:02',
      'chef-departement',
    ]);
  }
}
