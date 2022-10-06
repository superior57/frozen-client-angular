import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModel } from './user.model';
import { EcritureTresorerieModel } from './ecriture-tresorerie.model';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: UserModel, useClass: UserModel },
    { provide: EcritureTresorerieModel, useClass: EcritureTresorerieModel },
  ],
})
export class ModelModule {}
