import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule, MdcModule } from '../material';
import { CommonModule } from '../common';
import { FormsModule } from '@angular/forms';
import { InvoiceComponent } from './invoice/invoice.component';
import { ModelModule } from './model';
import { NewLineItemComponent } from './new-line-item/new-line-item.component';
import { FinanceModule } from '../finance';
import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { LatestDataComponent } from './latest-data/latest-data.component';
import { FactsComponent } from './facts/facts.component';
import { ReceptionMenuComponent } from './reception-menu/reception-menu.component';
import { ReceptionComponent } from './reception/reception.component';
import { NewBillEntryComponent } from './new-bill-entry/new-bill-entry.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientListActionComponent } from './patient-list-action/patient-list-action.component';
import { DepartmentsMenuComponent } from './departments-menu/departments-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PatientSearchDialogComponent } from './patient-search-dialog/patient-search-dialog.component';
import { DocumentLineActionComponent } from './document-line-action/document-line-action.component';
import { GenderCellEditorComponent } from './gender-cell-editor/gender-cell-editor.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    HomeComponent,
    InvoiceComponent,
    NewLineItemComponent,
    ActionsComponent,
    ActionComponent,
    PatientSearchComponent,
    NewPatientComponent,
    LatestDataComponent,
    FactsComponent,
    ReceptionMenuComponent,
    ReceptionComponent,
    NewBillEntryComponent,
    PatientsListComponent,
    PatientListActionComponent,
    DepartmentsMenuComponent,
    DashboardComponent,
    PatientSearchDialogComponent,
    DocumentLineActionComponent,
    GenderCellEditorComponent,
  ],
  imports: [
    AngularCommonModule,
    CommonModule,
    MaterialModule,
    MdcModule,
    FormsModule,
    ModelModule,
    FinanceModule,
    NgxChartsModule,
    AgGridModule,
  ],
})
export class HomeModule {}
