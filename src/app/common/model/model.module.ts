import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModel } from './menu.model';
import { MaterialModule } from 'src/app/material';
import { AccountsModel } from './accounts.model';
import { SessionModel } from './session.model';
import { ConnectionModel } from './connection.model';
import { DepartmentModel } from './department.model';
import { EquationRepartitionModel } from './equation-repartition.model';
import { ReceptionModel } from './reception.model';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule],
  providers: [
    { provide: MenuModel, useClass: MenuModel },
    { provide: AccountsModel, useClass: AccountsModel },
    { provide: SessionModel, useClass: SessionModel },
    { provide: ConnectionModel, useClass: ConnectionModel },
    { provide: DepartmentModel, useClass: DepartmentModel },
    { provide: EquationRepartitionModel, useClass: EquationRepartitionModel },
    { provide: ReceptionModel, useClass: ReceptionModel },
  ],
})
export class ModelModule {}
