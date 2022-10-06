import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { DepartmentModel } from '../common/model';
import { AccountEntryModel, Ecriture, EcritureModel } from '../finance/model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  ecritures$: Observable<Ecriture[]>;
  api: GridApi;
  gridOptions: GridOptions = {
    defaultColDef: {
      editable: false,
    },
    columnDefs: [
      {
        headerName: 'Mois',
        field: 'mois',
        valueFormatter: (params) => this.monthToLocaleName(params.value),
      },
      {
        headerName: 'Entrées',
        field: 'montantTotal',
        valueFormatter: (params) => params.value?.toFixed(2),
      },
      {
        headerName: 'Sorties',
        field: 'totalDepenses',
        valueFormatter: (params) => ((params.value || 0) * -1)?.toFixed(2),
      },
      {
        headerName: 'Solde',
        valueGetter: (params) =>
          (params.data?.montantTotal || 0) + (params.data?.totalDepenses || 0),
        valueFormatter: (params) => (params.value || 0)?.toFixed(2),
      },
    ],
  };

  constructor(
    ecritureModel: EcritureModel,
    periodModel: AccountEntryModel,
    departementModel: DepartmentModel
  ) {
    const period$ = periodModel.period$.pipe(filter((p) => !!p));
    const departement$ = departementModel.selected$.pipe(filter((d) => !!d));
    this.ecritures$ = combineLatest([period$, departement$]).pipe(
      switchMap(([period, departement]) => {
        const year = period.selectedYear;
        return ecritureModel.filter({
          year,
          sort: '-date',
          departement: departement.id,
        });
      })
    );
  }

  onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
  }

  private monthToLocaleName(month: number): string {
    switch (month) {
      case 1:
        return 'Janvier';
      case 2:
        return 'Février';
      case 3:
        return 'Mars';
      case 4:
        return 'Avril';
      case 5:
        return 'Mai';
      case 6:
        return 'Juin';
      case 7:
        return 'Juillet';
      case 8:
        return 'Août';
      case 9:
        return 'Septembre';
      case 10:
        return 'Octobre';
      case 11:
        return 'Novembre';
      case 12:
        return 'Décembre';
    }
  }
}
