import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountEntry, AccountEntryModel, AccountEntryType } from '../model';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-log-income',
  templateUrl: './account-log-income.component.html',
  styleUrls: ['./account-log-income.component.scss'],
})
export class AccountLogIncomeComponent implements AfterViewInit {
  incomeDataSource$: Observable<AccountEntry[]>;
  dataColumns: string[];
  displayedColumns: string[];
  columnsData: { column: string; displayName: string }[] = [
    { column: 'approve', displayName: 'Approuvé' },
    { column: 'designation', displayName: 'Désigation' },
    { column: 'quantite', displayName: 'Quantité' },
    { column: 'prixUnitaire', displayName: 'Prix Unitaire' },
    { column: 'prixTotal', displayName: 'Prix total' },
    { column: 'date', displayName: 'Date' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private accountEntries: AccountEntryModel) {
    this.dataColumns = this.columnsData
      .filter((column) => column.column !== 'actions')
      .map((column) => column.column);
    this.displayedColumns = this.columnsData.map((column) => column.column);
    this.displayedColumns.push('actions');
  }

  ngAfterViewInit(): void {
    this.incomeDataSource$ = this.accountEntries.entries$.pipe(
      map((entries: AccountEntry[]) => {
        return entries.filter(
          (entry: AccountEntry) => entry.type === AccountEntryType.ENTREE
        );
      })
    );
  }

  getEntryApprovedIcon(entry: AccountEntry): string {
    return 'horizontal_rule';
  }
}
