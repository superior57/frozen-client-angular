import { NgModule } from '@angular/core';
import { CommonModule } from '../common';
import { FinanceComponent } from './finance.component';
import { MaterialModule, MdcModule } from '../material';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { AccountLogComponent } from './account-log/account-log.component';
import { ModelModule } from './model';
import { AccountLogIncomeComponent } from './account-log-income/account-log-income.component';
import { AccountLogAllComponent } from './account-log-all/account-log-all.component';
import { AccountLogOutcomeComponent } from './account-log-outcome/account-log-outcome.component';
import { PipesModule } from './pipes';

@NgModule({
  declarations: [
    FinanceComponent,
    AccountLogComponent,
    AccountLogIncomeComponent,
    AccountLogAllComponent,
    AccountLogOutcomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MdcModule,
    FormsModule,
    MatNativeDateModule,
    ModelModule,
    PipesModule,
  ],
  exports: [
    AccountLogAllComponent,
    AccountLogIncomeComponent,
    AccountLogOutcomeComponent,
  ],
})
export class FinanceModule {}
