import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteModel } from './quote.model';
import { PatientModel } from './patient.model';
import { DocumentModel } from './document.model';
import { CanActivateReception } from './can-activate-reception';
import { StatsModel } from './stats.model';
import { AgentModel } from './agent.model';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: QuoteModel, useClass: QuoteModel },
    { provide: PatientModel, useClass: PatientModel },
    { provide: AgentModel, useClass: AgentModel },
    { provide: DocumentModel, useClass: DocumentModel },
    { provide: CanActivateReception, useClass: CanActivateReception },
    { provide: StatsModel, useClass: StatsModel },
  ],
})
export class ModelModule {}
