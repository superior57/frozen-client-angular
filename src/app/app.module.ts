import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from './common';
import { UserModule } from './user';
import { FinanceModule } from './finance';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TreasuryModule } from './treasury';
import { HomeModule } from './home';
import { LoginModule } from './login';
import { MaterialModule, MdcModule } from './material';
import { ReportsModule } from './reports';
import { ConsultationModule } from './consultation';

registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    UserModule,
    FinanceModule,
    TreasuryModule,
    HomeModule,
    LoginModule,
    MaterialModule,
    MdcModule,
    ReportsModule,
    ConsultationModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
