import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceComponent } from '../invoice/invoice.component';
import { NewPatientComponent } from '../new-patient/new-patient.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  constructor(private dialog: MatDialog) {}

  onNewQuoteClick(): void {
    this.dialog.open(InvoiceComponent);
  }

  onNewPatientClick(): void {
    this.dialog.open(NewPatientComponent);
  }
}
