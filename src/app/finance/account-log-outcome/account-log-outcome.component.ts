import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AccountEntry, AccountEntryModel, AccountEntryType } from '../model';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-log-outcome',
  templateUrl: './account-log-outcome.component.html',
  styleUrls: ['./account-log-outcome.component.scss'],
})
export class AccountLogOutcomeComponent implements AfterViewInit {
  outcomeDataSource$: Observable<MatTableDataSource<AccountEntry>>;
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

  @ViewChild(MatPaginator) outcomePaginator: MatPaginator;

  constructor(private accountEntries: AccountEntryModel) {
    this.dataColumns = this.columnsData
      .filter((column) => column.column !== 'actions')
      .map((column) => column.column);
    this.displayedColumns = this.columnsData.map((column) => column.column);
    this.displayedColumns.push('actions');
  }

  ngAfterViewInit(): void {
    this.outcomeDataSource$ = this.accountEntries.entries$.pipe(
      map((entries: AccountEntry[]) => {
        const filteredEntries = entries.filter(
          (entry: AccountEntry) => entry.type === AccountEntryType.SORTIE
        );
        const dataSource = new MatTableDataSource<AccountEntry>(
          filteredEntries
        );
        dataSource.paginator = this.outcomePaginator;
        return dataSource;
      })
    );
  }

  getEntryApprovedIcon(entry: AccountEntry): string {
    return entry.approuve ? 'check' : 'cancel';
  }
}
