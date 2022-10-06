import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AccountEntryModel, Ecriture, EcritureModel } from '../model';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  CellValueChangedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { DepartmentModel } from 'src/app/common/model';
import { getQueryDateOrDateRange } from 'src/app/common';
import { UserModel } from 'src/app/user';
import { DateCellEditorComponent } from 'src/app/common/date-cell-editor/date-cell-editor.component';
import { DateCellRendererComponent } from 'src/app/common/date-cell-renderer/date-cell-renderer.component';
import { CurrencyCellEditorComponent } from 'src/app/common/currency-cell-editor/currency-cell-editor.component';
import { EcritureActionsCellRendererComponent } from 'src/app/common/ecriture-actions-cell-renderer/ecriture-actions-cell-renderer.component';
import { NumberCellEditorComponent } from 'src/app/common/number-cell-editor/number-cell-editor.component';

@Component({
  selector: 'app-account-log-all',
  templateUrl: './account-log-all.component.html',
  styleUrls: ['./account-log-all.component.scss'],
})
export class AccountLogAllComponent {
  private ecritures: Ecriture[];
  gridOptions$: Observable<GridOptions>;
  ecritures$: Observable<Ecriture[]>;
  totalFooterRow: Ecriture;
  api: GridApi;

  constructor(
    private accountEntries: AccountEntryModel,
    private ecritureModel: EcritureModel,
    private departmentModel: DepartmentModel,
    private userModel: UserModel
  ) {
    this.gridOptions$ = userModel.activeUser.pipe(
      filter((u) => !!u),
      map((user) => user.roles.some((role) => role.label === 'admin')),
      map((editable) => this.getGridOptions(editable))
    );
  }

  onGridReady(event: GridReadyEvent): void {
    const period$ = this.accountEntries.period$.pipe(filter((p) => !!p));
    const department$ = this.departmentModel.selected$.pipe(filter((d) => !!d));
    this.api = event.api as GridApi;
    this.ecritures$ = combineLatest([period$, department$])
      .pipe(
        switchMap(([period, departement]) => {
          const dates = getQueryDateOrDateRange(period);
          if (dates instanceof Array) {
            return this.ecritureModel.filter({
              dateRange: dates,
              departement: departement.id,
              ecartEgalA: 0,
              sort: '-date',
            });
          } else {
            return this.ecritureModel.filter({
              date: dates,
              departement: departement.id,
              ecartEgalA: 0,
              sort: '-date',
            });
          }
        })
      )
      .pipe(
        map((ecritures) =>
          ecritures.map((ecriture) => {
            return {
              ...ecriture,
              montant: ecriture.devise === 'USD' ? ecriture.montant : 0,
              montantCdf: ecriture.devise === 'CDF' ? ecriture.montant : 0,
            };
          })
        ),
        tap((ecritures) => {
          this.ecritures = ecritures;
          this.recalculateTotalFooterRow();
          if (this.totalFooterRow) {
            this.api.setPinnedBottomRowData([this.totalFooterRow]);
          }
        })
      );
  }

  private recalculateTotalFooterRow(): void {
    if (this.ecritures.length > 0) {
      if (this.ecritures.length === 0) {
        this.totalFooterRow = this.ecritures[0];
        (this.totalFooterRow as any).date = 'Totaux';
        this.totalFooterRow.libele = 'N/A';
      } else {
        this.totalFooterRow = this.ecritures.reduce(
          (previous, current, index) => {
            if (index === 1) {
              previous = JSON.parse(JSON.stringify(previous));
              (previous as any).date = 'Totaux';
              previous.libele = 'N/A';
            }
            previous.montant += current.montant;
            previous.montantCdf += current.montantCdf;
            return previous;
          }
        );
      }
    } else {
      if (this.totalFooterRow) {
        this.totalFooterRow.libele = 'N/A';
        this.totalFooterRow.montant = 0;
        this.totalFooterRow.montantCdf = 0;
      } else {
        this.totalFooterRow = null;
      }
    }
  }

  private getGridOptions(gridEditable: boolean): GridOptions {
    return {
      frameworkComponents: {
        dateCellRenderer: DateCellRendererComponent,
        dateCellEditor: DateCellEditorComponent,
        currencyCellEditor: CurrencyCellEditorComponent,
        ecritureActionsCellRenderer: EcritureActionsCellRendererComponent,
        numberCellEditor: NumberCellEditorComponent,
      },
      defaultColDef: {
        resizable: true,
        editable: (params) => gridEditable && !params.node.isRowPinned(),
      },
      columnDefs: [
        {
          headerName: 'Date',
          field: 'date',
          cellEditor: 'dateCellEditor',
          cellRenderer: 'dateCellRenderer',
          valueFormatter: (params) =>
            params.value && params.value !== 'Totaux' ? params.value : 'Totaux',
        },
        {
          headerName: 'Service rendu',
          field: 'libele',
        },
        {
          headerName: 'Montant (USD)',
          cellEditor: 'numberCellEditor',
          field: 'montant',
          valueSetter: (params) => {
            params.data.montant = params.newValue;
            params.data.montantCdf = 0;
            params.data.devise = 'USD';
            this.recalculateTotalFooterRow();
            return true;
          },
          valueGetter: (params) => params.data?.montant,
          valueFormatter: (params) => params.data.montant.toFixed(2),
        },
        {
          headerName: 'Montant (CDF)',
          cellEditor: 'numberCellEditor',
          field: 'montant',
          valueSetter: (params) => {
            params.data.montant = params.newValue;
            params.data.montantCdf = params.newValue;
            params.data.devise = 'CDF';
            this.recalculateTotalFooterRow();
            return true;
          },
          valueGetter: (params) => params.data?.montantCdf,
          valueFormatter: (params) => params.data.montantCdf.toFixed(2),
        },
        {
          headerName: 'Encodeur',
          valueGetter: (params) => {
            if (params.node.isRowPinned()) {
              return '';
            }
            return params.data?.piece?.operateur;
          },
          editable: false,
        },
        {
          headerName: 'Actions',
          cellRenderer: 'ecritureActionsCellRenderer',
          width: 366,
          editable: false,
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
