import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDispatchSettingModel } from './account-dispatch-setting.model';
import { CompteModel } from './compte-model';
import { EcritureRepartitionModel } from './ecriture-repartition.model';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: AccountDispatchSettingModel,
      useClass: AccountDispatchSettingModel,
    },
    { provide: CompteModel, useClass: CompteModel },
    { provide: EcritureRepartitionModel, useClass: EcritureRepartitionModel },
  ],
})
export class ModelModule {}
