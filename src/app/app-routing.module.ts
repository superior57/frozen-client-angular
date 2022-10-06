import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './user';
import { FinanceComponent } from './finance';
import { TreasuryComponent } from './treasury';
import { HomeComponent } from './home';
import { CanActivateUser, LoginComponent } from './login';
import { SplashComponent } from './common/splash/splash.component';
import { ReceptionComponent } from './home/reception/reception.component';
import { InvoiceComponent } from './home/invoice/invoice.component';
import { PatientsListComponent } from './home/patients-list/patients-list.component';
import { LossComponent } from './treasury/loss/loss.component';
import { ReportsComponent } from './reports';
import { ConsultationComponent } from './consultation';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'utilisateurs',
    component: UsersComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'finances',
    component: FinanceComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'tresorerie',
    component: TreasuryComponent,
    canActivate: [CanActivateUser],
  },
  { path: 'acceuil', component: HomeComponent, canActivate: [CanActivateUser] },
  {
    path: 'consultation',
    component: ConsultationComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'reception',
    component: ReceptionComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'facture/:mode',
    component: InvoiceComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'patients',
    component: PatientsListComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'loss',
    component: LossComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [CanActivateUser],
  },
  {
    path: 'consultation',
    component: ConsultationComponent,
    canActivate: [CanActivateUser],
  },
  { path: 'splash', component: SplashComponent },
  { path: '', pathMatch: 'full', redirectTo: 'acceuil' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
