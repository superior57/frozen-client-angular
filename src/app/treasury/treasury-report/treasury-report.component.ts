import { Component, OnDestroy } from '@angular/core';
import {
  ColDef,
  CsvExportParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { getQueryDateOrDateRange } from 'src/app/common';
import {
  DepartmentModel,
  EquationRepartition,
  EquationRepartitionModel,
} from 'src/app/common/model';
import {
  AccountEntryModel,
  Ecriture,
  EcritureModel,
} from 'src/app/finance/model';
import { Patient, PatientModel } from 'src/app/home/model';
import { UserModel } from 'src/app/user';
import {
  Compte,
  CompteModel,
  DispatchSetting,
  DispatchSettingPart,
  EcritureRepartition,
} from '../model';

const DATE_LOCALE = 'fr-FR';

@Component({
  selector: 'app-treasury-report',
  templateUrl: './treasury-report.component.html',
  styleUrls: ['./treasury-report.component.scss'],
})
export class TreasuryReportComponent implements OnDestroy {
  private readonly destroy$: BehaviorSubject<void> = new BehaviorSubject(null);
  private readonly defaultColumns: string[] = [
    'date',
    'designation',
    'prixTotal',
    'patients',
  ];

  private dispatch: DispatchSetting;

  readonly defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  } as ColDef;

  readonly dateColumn: ColDef = {
    headerName: 'Date',
    field: 'date',
    valueFormatter: (params) =>
      params.value && params.value !== 'Totaux'
        ? new Date(params.value).toLocaleDateString(DATE_LOCALE)
        : 'Totaux',
  };
  readonly libele: ColDef = {
    headerName: 'Service rendu',
    field: 'libele',
  };
  readonly montantColumn: ColDef = {
    headerName: 'Montant',
    valueGetter: (params) => {
      if (params.data?.devise === 'USD') {
        return (params.data.montant || 0).toFixed(2);
      } else {
        return (
          (params.data.montant || 0) / params.data?.tauxDeChange.taux
        ).toFixed(2);
      }
    },
    valueFormatter: (params) => (params.value || '0') + ' $US',
  };

  equations$: Observable<EquationRepartition[]>;
  comptes$: Observable<Compte[]>;
  ecritures$: Observable<Ecriture[]>;
  patients$: Observable<Patient[]>;
  totalFooterData: Ecriture;

  columns$: Observable<ColDef[]>;
  api: GridApi;

  constructor(
    public userModel: UserModel,
    private equationRepartitionModel: EquationRepartitionModel,
    private ecritureModel: EcritureModel,
    private patientModel: PatientModel,
    private departmentModel: DepartmentModel,
    private accountEntryModel: AccountEntryModel,
    private compteModel: CompteModel
  ) {
    this.reloadData();
  }

  private reloadData(): void {
    const departement$ = this.departmentModel.selected$.pipe(
      filter((d) => !!d)
    );
    const period$ = this.accountEntryModel.period$.pipe(filter((p) => !!p));
    this.ecritures$ = combineLatest([period$, departement$])
      .pipe(
        switchMap(([period, department]) => {
          const date = getQueryDateOrDateRange(period);
          return this.ecritureModel.filter({
            departement: department.id,
            dateRange: date,
            sort: '-date',
            threshold: 0,
            ecart: 0,
          });
        })
      )
      .pipe(
        tap((ecritures) => {
          this.calculateTotalFooterData(ecritures);

          if (!!this.totalFooterData) {
            this.api.setPinnedBottomRowData([this.totalFooterData]);
          }
        })
      );

    this.patients$ = this.ecritures$.pipe(
      switchMap((ecritures) =>
        this.patientModel.filter({ id: ecritures.map((e) => e.piece?.patient) })
      )
    );

    this.comptes$ = this.compteModel.all();
    const patients$ = this.patients$.pipe(filter((p) => !!p));
    this.columns$ = combineLatest([
      this.comptes$,
      departement$,
      patients$,
      period$,
    ]).pipe(
      filter((d) => !!d),
      switchMap(([comptes, departement, patients, period]) => {
        const dates = getQueryDateOrDateRange(period);
        this.equations$ = this.equationRepartitionModel.filter({
          departement: departement.id,
          count: 1,
          sort: '-date',
          lowerDateBound: dates[1],
        });
        return this.equations$.pipe(
          filter((e) => !!e),
          map((equations) => [
            this.dateColumn,
            this.libele,
            this.createPatientColumn(patients),
            this.montantColumn,
            ...this.createColumnsFromEquation(equations[0], comptes),
          ])
        );
      })
    );
  }

  private calculateTotalFooterData(ecritures: Ecriture[]): void {
    if (ecritures && ecritures.length > 0) {
      this.totalFooterData = ecritures.reduce((previous, current, index) => {
        if (index === 1) {
          previous = JSON.parse(JSON.stringify(previous));
          (previous as any).date = 'Totaux';
          previous.libele = 'Total';
          previous.piece = null;
        }
        previous.montant += current.montant;
        this.calculateAndAddDispatches(previous, current);
        return previous;
      });
    } else {
      if (this.totalFooterData) {
        this.totalFooterData.montant = 0;
        this.totalFooterData.montantCdf = 0;
      } else {
        this.totalFooterData = null;
      }
    }
  }

  private calculateAndAddDispatches(
    previous: Ecriture,
    current: Ecriture
  ): void {
    previous.ecrituresRepartitions.forEach(
      (ecritureRepartition: EcritureRepartition) => {
        ecritureRepartition.montant += current.ecrituresRepartitions.find(
          (e) => e.compte === ecritureRepartition.compte
        )?.montant;
      }
    );
  }

  private createPatientColumn(patients: Patient[]): ColDef {
    return {
      headerName: 'Patient',
      valueGetter: (params) =>
        this.getPatientName(
          patients.find((p) => p.id === params.data?.piece?.patient)
        ),
    };
  }

  private createColumnsFromEquation(
    equation: EquationRepartition,
    comptes: Compte[]
  ): ColDef[] {
    if (!equation) return [];

    this.dispatch = JSON.parse(equation.formatAffichable);
    const columns: ColDef[] = [];

    this.appendFixedAmountColumnToColumns(
      columns,
      this.dispatch.fixed,
      comptes
    );
    this.appendRatioAmountColumnToColumns(
      columns,
      this.dispatch.ratio,
      comptes
    );
    return columns;
  }

  private appendFixedAmountColumnToColumns(
    columns: ColDef[],
    fixed: DispatchSettingPart,
    comptes: Compte[]
  ): void {
    const compte = comptes.find((c) => c.code === fixed.label);
    const coldef: ColDef = this.createColDefFromCompte(compte, fixed, true);
    columns.push(coldef);
  }

  private createColDefFromCompte(
    compte: Compte,
    dispatch: DispatchSettingPart,
    isFixed: boolean = false
  ): ColDef {
    const headerName = isFixed
      ? `${compte?.intitule} (${dispatch?.amount} $US)`
      : `${compte?.intitule} (${dispatch?.amount}%)`;
    return {
      headerName,
      valueGetter: (params) =>
        (
          params.data?.ecrituresRepartitions.find((e) => e.compte === compte.id)
            ?.montant || 0
        ).toFixed(2),
      valueFormatter: (params) => (params.value || '0') + ' US$',
    };
  }

  private appendRatioAmountColumnToColumns(
    columns: ColDef[],
    ratios: DispatchSettingPart[],
    comptes: Compte[]
  ): void {
    ratios.forEach((ratio: DispatchSettingPart) => {
      const compte = comptes.find((c) => c.code === ratio.label);

      if (ratio.label) {
        const coldef = this.createColDefFromCompte(compte, ratio);
        columns.push(coldef);
      } else {
        const coldef = {
          headerName: `Sous répartition (${ratio.amount}%)`,
          children: [],
        };
        this.appendRatioAmountColumnToColumns(
          coldef.children,
          ratio.ratio,
          comptes
        );
        columns.push(coldef);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private setupGrid(event: GridReadyEvent): void {
    this.api = event.api;
    this.columns$.subscribe((columns) => {
      event.api.setColumnDefs(columns);
      event.columnApi.autoSizeAllColumns();
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.setupGrid(event);
  }

  exportCsv(): void {
    const period$ = this.accountEntryModel.period$.pipe(filter((p) => !!p));
    const departement$ = this.departmentModel.selected$.pipe(
      filter((d) => !!d)
    );

    combineLatest([period$, departement$])
      .pipe(take(1))
      .subscribe(([period, departement]) => {
        const dates = getQueryDateOrDateRange(period);
        const date = new Date(dates[1]);
        const filename = `${departement.intitule.toLowerCase()}_rapport-resorerie_${
          date.getMonth() + 1
        }_${date.getFullYear()}.csv`;
        this.api.exportDataAsCsv({
          fileName: filename,
        } as CsvExportParams);
      });
  }

  private getPatientName(patient: Patient): string {
    return `${patient?.nom || ''} ${patient?.postnom || ''} ${
      patient?.prenom || ''
    }`;
  }

  recalculate(): void {
    const period = this.accountEntryModel.period$.pipe(filter((p) => !!p));
    const department = this.departmentModel.selected$.pipe(filter((d) => !!d));
    const equations = this.equations$.pipe(filter((e) => !!e));

    combineLatest([period, department, equations])
      .pipe(
        switchMap(([period, department, equations]) =>
          this.compteModel.recalculate(
            period,
            department,
            equations.find((e) => e.departement === department.id)
          )
        ),
        catchError((e) => {
          return EMPTY;
        }),
        take(1)
      )
      .subscribe((res) => {
        this.reloadData();
      });
  }

  onFreeEntriesGridReady(event: GridReadyEvent): void {}
}
