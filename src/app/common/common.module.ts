import { NgModule } from '@angular/core';
import { MaterialModule, MdcModule } from '../material';
import { UserOptionsComponent } from './user-options/user-options.component';
import { ModelModule } from './model';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { PipesModule } from './pipes';
import { FormsModule } from '@angular/forms';
import { PeriodSelectorComponent } from './period-selector';
import { AgGridModule } from 'ag-grid-angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SplashComponent } from './splash/splash.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NoConnectionComponent } from './no-connection/no-connection.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { DateCellEditorComponent } from './date-cell-editor/date-cell-editor.component';
import { DateCellRendererComponent } from './date-cell-renderer/date-cell-renderer.component';
import { CurrencyCellEditorComponent } from './currency-cell-editor/currency-cell-editor.component';
import { EcritureActionsCellRendererComponent } from './ecriture-actions-cell-renderer/ecriture-actions-cell-renderer.component';
import { NumberCellEditorComponent } from './number-cell-editor/number-cell-editor.component';
import { EcritureTresorerieLabelCellEditorComponent } from './ecriture-tresorerie-label-cell-editor/ecriture-tresorerie-label-cell-editor.component';

@NgModule({
  declarations: [
    UserOptionsComponent,
    ConfirmationDialogComponent,
    DepartmentListComponent,
    PeriodSelectorComponent,
    SplashComponent,
    SearchBarComponent,
    NoConnectionComponent,
    BottomBarComponent,
    TopBarComponent,
    DocumentPreviewComponent,
    ErrorDialogComponent,
    InfoDialogComponent,
    WarningDialogComponent,
    DateCellEditorComponent,
    DateCellRendererComponent,
    CurrencyCellEditorComponent,
    EcritureActionsCellRendererComponent,
    NumberCellEditorComponent,
    EcritureTresorerieLabelCellEditorComponent,
  ],
  imports: [
    MaterialModule,
    MdcModule,
    ModelModule,
    FormsModule,
    AngularCommonModule,
    RouterModule,
    AgGridModule,
  ],
  exports: [
    DepartmentListComponent,
    AngularCommonModule,
    PipesModule,
    PeriodSelectorComponent,
    PeriodSelectorComponent,
    AgGridModule,
    NgxDatatableModule,
    SplashComponent,
    SearchBarComponent,
    NoConnectionComponent,
    BottomBarComponent,
    TopBarComponent,
    DocumentPreviewComponent,
    ErrorDialogComponent,
    WarningDialogComponent,
    DateCellEditorComponent,
    DateCellRendererComponent,
    CurrencyCellEditorComponent,
    EcritureTresorerieLabelCellEditorComponent,
  ],
})
export class CommonModule {}
