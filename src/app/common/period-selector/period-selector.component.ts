import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { AccountEntryModel } from 'src/app/finance/model/account-entry.model';
import { AccountingPeriodType } from 'src/app/finance/model/accounting-period-type';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
})
export class PeriodSelectorComponent implements AfterViewInit {
  readonly initialYear: number = 2019;
  selectedDate = new Date();
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  years: number[] = [];
  months: string[] = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  @Input()
  periodTypes: AccountingPeriodType[] = [
    AccountingPeriodType.Journalier,
    AccountingPeriodType.Mensuel,
    AccountingPeriodType.Annuel,
  ];

  @ViewChild('periodType') periodType: MatSelect;

  constructor(private entriesModel: AccountEntryModel) {
    for (let y = this.initialYear; y <= this.selectedYear; y++) {
      this.years.push(y);
    }
  }

  ngAfterViewInit(): void {
    this.onSubmitForm();
  }

  onSubmitForm(): void {
    this.entriesModel.setPeriod({
      type: this.periodType.value as AccountingPeriodType,
      selectedDate: this.selectedDate,
      selectedMonth: this.selectedMonth,
      selectedYear: this.selectedYear,
    });
  }

  getDefaultPeriodType(): AccountingPeriodType {
    return this.periodTypes.includes(AccountingPeriodType.Mensuel)
      ? AccountingPeriodType.Mensuel
      : this.periodTypes[0];
  }
}
