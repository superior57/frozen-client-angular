import { Component, Input } from '@angular/core';
import {
  Compte,
  CompteModel,
  EcritureRepartition,
  EcritureRepartitionModel,
} from '../model';
import { combineLatest, Observable } from 'rxjs';
import { ColDef, GridOptions } from 'ag-grid-community';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Document, DocumentModel } from 'src/app/home/model';
import { makeOutcomeColDefs } from './outcomes.coldefs';
import { expenseBillColDefs } from './expense-bill.coldefs';
import { ViewBillDetailsCellRendererComponent } from '../view-bill-details-cell-renderer/view-bill-details-cell-renderer.component';
import { AccountEntryModel } from 'src/app/finance/model';
import { getQueryDateOrDateRange } from 'src/app/common';
import { DateCellEditorComponent } from 'src/app/common/date-cell-editor/date-cell-editor.component';
import { DateCellRendererComponent } from 'src/app/common/date-cell-renderer/date-cell-renderer.component';

@Component({
  selector: 'app-treasury-outcome-table',
  templateUrl: './treasury-outcome-table.component.html',
  styleUrls: ['./treasury-outcome-table.component.scss'],
})
export class TreasuryOutcomeTableComponent {
  readonly gridOptions: GridOptions = {
    frameworkComponents: {
      viewBillDetails: ViewBillDetailsCellRendererComponent,
      dateCellRenderer: DateCellRendererComponent,
      dateCellEditor: DateCellEditorComponent,
    },
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
    },
  };

  oColDefs$: Observable<ColDef[]>;
  readonly bColDefs = expenseBillColDefs;
  comptes$: Observable<Compte[]>;
  bons$: Observable<Document[]>;
  ecritures$: Observable<EcritureRepartition[]>;

  @Input() readonly hideDashBoard: boolean = false;

  constructor(
    compteModel: CompteModel,
    documentModel: DocumentModel,
    entryModel: AccountEntryModel,
    ecritureRepartitionModel: EcritureRepartitionModel
  ) {
    this.comptes$ = compteModel.all().pipe(
      filter((c) => !!c),
      take(1)
    );

    this.bons$ = entryModel.period$.pipe(
      filter((p) => !!p),
      switchMap((period) => {
        const dateRange = getQueryDateOrDateRange(period);
        return documentModel
          .filter({ type: 'BON', dateRange, sort: '-date' })
          .pipe(filter((bons) => !!bons));
      })
    );

    this.ecritures$ = entryModel.period$.pipe(
      filter((p) => !!p),
      switchMap((period) => {
        const dates = getQueryDateOrDateRange(period);

        return ecritureRepartitionModel.filter({
          dateRange: dates,
        });
      })
    );

    const period$ = entryModel.period$.pipe(filter((p) => !!p));
    this.oColDefs$ = combineLatest([period$, this.ecritures$]).pipe(
      map(([period, ecritures]) => makeOutcomeColDefs(period, ecritures))
    );
  }
}
