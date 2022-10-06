import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { CommonModule } from 'src/app/common';
import { TreasuryComponent } from './treasury.component';
import { MaterialModule, MdcModule } from '../material';
import { FinanceModule } from '../finance';
import { ModelModule, TreasuryEntryModel, TreasuryAccountModel } from './model';
import { TreasuryIncomeTableComponent } from './treasury-income-table/treasury-income-table.component';
import { TreasuryOutcomeTableComponent } from './treasury-outcome-table/treasury-outcome-table.component';
import { TreasuryReportComponent } from './treasury-report/treasury-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { ExpenseBillListComponent } from './expense-bill-list/expense-bill-list.component';
import { ViewBillDetailsCellRendererComponent } from './view-bill-details-cell-renderer/view-bill-details-cell-renderer.component';
import { FormsModule } from '@angular/forms';
import { FreeEntriesListComponent } from './free-entries-list/free-entries-list.component';
import { TreasuryEntryActionsComponent } from './treasury-entry-actions/treasury-entry-actions.component';
import { TreasuryEntryJustifierComponent } from './treasury-entry-justifier/treasury-entry-justifier.component';
import { TreasuryEntryFormComponent } from './treasury-entry-form/treasury-entry-form.component';
import { LossComponent } from './loss/loss.component';

@NgModule({
  declarations: [
    TreasuryComponent,
    TreasuryIncomeTableComponent,
    TreasuryOutcomeTableComponent,
    TreasuryReportComponent,
    ExpenseBillListComponent,
    ViewBillDetailsCellRendererComponent,
    FreeEntriesListComponent,
    TreasuryEntryActionsComponent,
    TreasuryEntryJustifierComponent,
    TreasuryEntryFormComponent,
    LossComponent,
  ],
  imports: [
    AngularCommonModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    MdcModule,
    FinanceModule,
    ModelModule,
    AgGridModule,
  ],
  exports: [FreeEntriesListComponent],
  providers: [
    { provide: TreasuryEntryModel, useClass: TreasuryEntryModel },
    { provide: TreasuryAccountModel, useClass: TreasuryAccountModel },
  ],
})
export class TreasuryModule {}
