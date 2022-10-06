import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrescriptionLine } from '../models';

@Component({
  selector: 'app-prescription-dialog',
  templateUrl: './prescription-dialog.component.html',
  styleUrls: ['./prescription-dialog.component.scss']
})
export class PrescriptionDialogComponent {
  lines: PrescriptionLine[] = [];
  line: PrescriptionLine;

  constructor() {
    this.resetPrescriptionLine();
  }

  onFormSubmit(form: NgForm): boolean {
    if (form.invalid) {
      return false;
    }

    this.lines.push(this.line);
    this.resetPrescriptionLine();
    form.reset();
    console.log('Good');
    return true;
  }

  private resetPrescriptionLine(): void {
    this.line = {
      dosage: '',
      duree: '',
      medicament: ''
    }
  }
}
