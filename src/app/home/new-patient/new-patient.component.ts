import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, empty } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Patient, PatientModel } from '../model';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss'],
})
export class NewPatientComponent {
  patient: Patient = {};

  constructor(
    private patientModel: PatientModel,
    private snackBar: MatSnackBar,
    private dialog: MatDialogRef<NewPatientComponent>
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.patientModel
        .create(this.patient)
        .pipe(
          take(1),
          catchError(() => EMPTY)
        )
        .subscribe(() => {
          this.snackBar.open('Patient créé avec succès', 'Ok');
          this.dialog.close();
        });
    }
  }

  onCancel(): void {
    this.dialog.close();
  }
}
