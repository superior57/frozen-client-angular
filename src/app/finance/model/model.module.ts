import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountEntryModel } from './account-entry.model';
import { EcritureModel } from './ecriture.model';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: AccountEntryModel, useClass: AccountEntryModel },
    { provide: EcritureModel, useClass: EcritureModel },
  ],
})
export class ModelModule {}
