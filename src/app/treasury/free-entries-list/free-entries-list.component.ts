import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { getQueryDateOrDateRange } from 'src/app/common';
import { DepartmentModel } from 'src/app/common/model';
import {
  AccountEntryModel,
  Ecriture,
  EcritureModel,
} from 'src/app/finance/model';

@Component({
  selector: 'app-free-entries-list',
  templateUrl: './free-entries-list.component.html',
  styleUrls: ['./free-entries-list.component.scss'],
})
export class FreeEntriesListComponent {
  readonly defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  } as ColDef;

  colDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      valueFormatter: (params) =>
        params.value && params.value !== 'Totaux'
          ? new Date(params.value).toLocaleDateString('fr-FR')
          : 'Totaux',
    },
    {
      headerName: 'Libélé',
      field: 'libele',
    },
    {
      headerName: 'Manque à gagner',
      field: 'montant',
      valueFormatter: (params) => (params.value || 0).toFixed(2) + ' US$',
    },
  ];

  totalFooterRow: Ecriture;
  ecritures$: Observable<Ecriture[]>;
  api: GridApi;

  constructor(
    accountEntryModel: AccountEntryModel,
    ecritureModel: EcritureModel,
    departmentModel: DepartmentModel
  ) {
    const period$ = accountEntryModel.period$.pipe(filter((p) => !!p));
    const department$ = departmentModel.list$.pipe(
      filter((d) => !!d),
      map((departements) =>
        departements.find((d) => d.intitule === 'LABORATOIRE')
      )
    );

    this.ecritures$ = combineLatest([period$, department$])
      .pipe(
        switchMap(([period, department]) => {
          const dates = getQueryDateOrDateRange(period);
          return ecritureModel.filter({
            dateRange: dates,
            departement: department.id,
            ecartSuperieurA: 0,
          });
        })
      )
      .pipe(
        tap((ecritures) => {
          if (ecritures.length > 0) {
            this.totalFooterRow = ecritures.reduce(
              (previous, current, index) => {
                if (index === 1) {
                  previous = JSON.parse(JSON.stringify(previous));
                  previous.libele = 'N/A';
                  (previous as any).date = 'Totaux';
                }
                previous.montant += current.montant;
                return previous;
              }
            );
            this.api.setPinnedBottomRowData([this.totalFooterRow]);
          }
        })
      );
  }

  onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
  }
}
