import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { CookieService } from 'ngx-cookie-service';
import { CanActivateUser } from './can-activate-user';
import { CommonModule } from '../common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdcModule } from '../material';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    AngularCommonModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MdcModule,
  ],
  providers: [CookieService, CanActivateUser],
  exports: [LoginComponent],
})
export class LoginModule {}
