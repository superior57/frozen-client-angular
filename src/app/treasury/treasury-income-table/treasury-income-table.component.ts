import { Component } from '@angular/core';
import { AccountEntryModel } from 'src/app/finance/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { EcritureTresorerie } from '../model';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  CellValueChangedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { EcritureTresorerieModel, UserModel } from 'src/app/user';
import { TreasuryEntryActionsComponent } from '../treasury-entry-actions/treasury-entry-actions.component';
import { getQueryDateOrDateRange } from 'src/app/common';
import { NumberCellEditorComponent } from 'src/app/common/number-cell-editor/number-cell-editor.component';
import { DateCellEditorComponent } from 'src/app/common/date-cell-editor/date-cell-editor.component';
import { DateCellRendererComponent } from 'src/app/common/date-cell-renderer/date-cell-renderer.component';
import { EcritureActionsCellRendererComponent } from 'src/app/common/ecriture-actions-cell-renderer/ecriture-actions-cell-renderer.component';
import { EcritureTresorerieLabelCellEditorComponent } from 'src/app/common/ecriture-tresorerie-label-cell-editor/ecriture-tresorerie-label-cell-editor.component';

@Component({
  selector: 'app-treasury-income-table',
  templateUrl: './treasury-income-table.component.html',
  styleUrls: ['./treasury-income-table.component.scss'],
})
export class TreasuryIncomeTableComponent {
  private destroy$: BehaviorSubject<void> = new BehaviorSubject(null);

  gridOptions$: Observable<GridOptions>;

  ecritures$: Observable<EcritureTresorerie[]>;
  ecrituresNegatives$: Observable<EcritureTresorerie[]>;
  totalNegatif$: Observable<number>;
  totalFooterRow: EcritureTresorerie;
  api: GridApi;

  constructor(
    ecritureTresorerieModel: EcritureTresorerieModel,
    entriesModel: AccountEntryModel,
    userModel: UserModel
  ) {
    const period$ = entriesModel.period$.pipe(filter((p) => !!p));

    const ecritures = period$.pipe(
      switchMap((period) => {
        const dates = getQueryDateOrDateRange(period);
        return ecritureTresorerieModel.filter({
          dateRange: dates,
          sort: '-date',
        });
      })
    );
    this.ecritures$ = ecritures.pipe(
      map((ecritures) => ecritures.filter((e) => e.montantSysteme >= 0)),
      tap((ecritures) => {
        if (ecritures.length > 0) {
          (this.totalFooterRow = ecritures.reduce(
            (previous, current, index) => {
              if (index === 1) {
                previous = JSON.parse(JSON.stringify(previous));
                (previous as any).date = 'Totaux';
                previous.libele = 'N/A';
              }
              previous.montantSysteme += current.montantSysteme;
              previous.montant += current.montant;
              return previous;
            }
          )),
            this.api.setPinnedBottomRowData([this.totalFooterRow]);
        }
      })
    );
    this.totalNegatif$ = ecritures.pipe(
      map((ecritures) => ecritures.filter((e) => e.montantSysteme < 0)),
      map((ecritures) =>
        ecritures.length === 0
          ? 0
          : ecritures.map((e) => e.montantSysteme).reduce((p, c) => p + c)
      ),
      takeUntil(this.destroy$)
    );

    this.gridOptions$ = userModel.activeUser.pipe(
      filter((u) => !!u),
      map((user) => user.roles.some((role) => role.label === 'admin')),
      map((editable) => this.createGridOptions(editable)),
      take(1)
    );
  }

  calculateTotal(ecritures: EcritureTresorerie[]): number {
    return ecritures?.length > 0
      ? ecritures.map((e) => e.montantSysteme).reduce((p, c) => p + c)
      : 0;
  }

  onGridReady(event: GridReadyEvent): void {
    this.api = event.api as GridApi;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private createGridOptions(gridEditable: boolean): GridOptions {
    return {
      frameworkComponents: {
        treasuryEntryActions: TreasuryEntryActionsComponent,
        numberCellEditor: NumberCellEditorComponent,
        dateCellEditor: DateCellEditorComponent,
        dateCellRenderer: DateCellRendererComponent,
        ecritureActionsCellRenderer: EcritureActionsCellRendererComponent,
        libeleCellEditor: EcritureTresorerieLabelCellEditorComponent,
      },
      defaultColDef: {
        resizable: true,
        editable: (params) => gridEditable && !params.node.isRowPinned(),
      },
      columnDefs: [
        {
          headerName: 'Date',
          field: 'date',
          cellRenderer: 'dateCellRenderer',
          cellEditor: 'dateCellEditor',
          width: 150,
        },
        {
          headerName: 'Libélé',
          cellEditor: 'libeleCellEditor',
          width: 200,
          field: 'libele',
        },
        {
          headerName: 'USD Système',
          width: 150,
          cellEditor: 'numberCellEditor',
          valueSetter: (params) => {
            params.data.montantSysteme = params.newValue;
            params.data.devise = 'USD';
            return true;
          },
          valueGetter: (params) => params.data?.montantSysteme,
          valueFormatter: (params) => {
            return params.data?.devise === 'USD'
              ? params.data.montantSysteme.toFixed(2) + ' US$'
              : '0';
          },
        },
        {
          headerName: 'CDF Système',
          width: 150,
          cellEditor: 'numberCellEditor',
          valueSetter: (params) => {
            params.data.montantSysteme = params.newValue;
            params.data.devise = 'CDF';
            return true;
          },
          valueGetter: (params) => params.data?.montantSysteme,
          valueFormatter: (params) =>
            params.data?.devise === 'CDF'
              ? params.data.montantSysteme.toFixed(2) + ' CDF'
              : '0 CDF',
        },
        {
          headerName: 'USD Montant versé',
          width: 150,
          cellEditor: 'numberCellEditor',
          valueSetter: (params) => {
            params.data.montant = params.newValue;
            params.data.devise = 'USD';
            return true;
          },
          valueGetter: (params) => params.data?.montant,
          valueFormatter: (params) =>
            params.data?.devise === 'USD'
              ? params.data.montant.toFixed(2) + ' US$'
              : '0 US$',
        },
        {
          headerName: 'CDF Montant versé',
          cellEditor: 'numberCellEditor',
          width: 150,
          valueSetter: (params) => {
            params.data.montant = params.newValue;
            params.data.devise = 'CDF';
            return true;
          },
          valueGetter: (params) => params.data?.montant,
          valueFormatter: (params) =>
            params.data?.devise === 'CDF'
              ? params.data.montant.toFixed(2) + ' CDF'
              : '0 CDF',
        },
        {
          headerName: 'Écart (USD)',
          width: 150,
          valueGetter: (params) => {
            if (params.data.devise === 'USD') {
              return params.data?.montant - params.data?.montantSysteme || 0;
            } else {
              return 0;
            }
          },
          valueFormatter: (params) => params.value?.toFixed(2) + ' US$',
          editable: false,
        },
        {
          headerName: 'Écart (CDF)',
          width: 150,
          valueGetter: (params) => {
            if (params.data.devise === 'CDF') {
              return params.data?.montant - params.data?.montantSysteme || 0;
            } else {
              return 0;
            }
          },
          valueFormatter: (params) => params.value?.toFixed(2) + ' CDF',
          editable: false,
        },
        {
          headerName: 'Actions',
          cellRenderer: 'ecritureActionsCellRenderer',
          editable: false,
          width: 366,
          cellRendererParams: {
            isEcritureTresorerie: true,
          },
        },
      ],
    };
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const isValueChanged: boolean = event.oldValue !== event.newValue;

    if (isValueChanged) {
      const cellRenderer = event.api.getCellRendererInstances({
        rowNodes: [event.node],
      })[0];
      (cellRenderer as any)._componentRef.instance.onValueChanged();
    }
  }
}
