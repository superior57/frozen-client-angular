import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { ConsultationComponent } from './consultation.component';
import { MaterialModule, MdcModule } from '../material';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrescriptionDialogComponent } from './prescription-dialog/prescription-dialog.component';
import { CommonModule } from '../common';
import { ConsultationsModel } from './models';

@NgModule({
  declarations: [ConsultationComponent, PrescriptionDialogComponent],
  imports: [
    AngularCommonModule,
    CommonModule,
    MaterialModule,
    MdcModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ConsultationComponent],
  providers: [{ provide: ConsultationsModel, useClass: ConsultationsModel }]
})
export class ConsultationModule {}
