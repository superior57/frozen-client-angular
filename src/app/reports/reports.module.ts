import { NgModule } from '@angular/core';
import { CommonModule as AngularCommon } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { CommonModule } from '../common';
import { MaterialModule, MdcModule } from '../material';

@NgModule({
  declarations: [ReportsComponent],
  imports: [AngularCommon, CommonModule, MaterialModule, MdcModule],
})
export class ReportsModule {}
