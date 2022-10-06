import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: ApiService, useClass: ApiService },
    { provide: ErrorHandlerService, useClass: ErrorHandlerService },
  ],
})
export class ServicesModule {}
