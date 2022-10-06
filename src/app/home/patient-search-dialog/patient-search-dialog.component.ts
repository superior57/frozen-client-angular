import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/user';
import { AgentModel, Patient, PatientModel } from '../model';

@Component({
  selector: 'app-patient-search-dialog',
  templateUrl: './patient-search-dialog.component.html',
  styleUrls: ['./patient-search-dialog.component.scss'],
})
export class PatientSearchDialogComponent {
  @ViewChild('nom') nom: ElementRef;
  @ViewChild('prenom') prenom: ElementRef;
  @ViewChild('postnom') postnom: ElementRef;

  entities$: Observable<Patient[] | User[]>;

  constructor(
    private patientModel: PatientModel,
    private agentModel: AgentModel,
    private dialog: MatDialogRef<PatientSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entity: string }
  ) {}

  onSearchClick() {
    let nom = this.nom.nativeElement.value;
    let prenom = this.prenom.nativeElement.value;
    let postnom = this.postnom.nativeElement.value;

    nom = nom.length === 0 ? '' : nom;
    prenom = prenom.length === 0 ? '' : prenom;
    postnom = postnom.length === 0 ? '' : postnom;

    if (
      (!nom && !prenom && !postnom) ||
      (nom === prenom && prenom === postnom && (nom?.length || 0) === 0)
    ) {
      return;
    }

    if (this.data.entity === 'patient') {
      this.entities$ = this.patientModel
        .search({
          searchedName: nom,
          searchedFirstName: prenom,
          searchedLastName: postnom,
        })
        .pipe(take(1));
    } else {
      this.entities$ = this.agentModel.search({
        searchedName: nom,
        searchedFirstName: prenom,
        searchedLastName: postnom,
      });
    }
  }

  getPatientFullName(patient: Patient): string {
    let fullName =
      this.getPatientMiddleName(patient) +
      ' ' +
      this.getPatientLastName(patient) +
      ' ' +
      this.getPatientFirstName(patient);
    return fullName.trim();
  }

  private getPatientFirstName(patient: Patient): string {
    return patient?.prenom && patient.prenom !== 'O' ? patient.prenom : '';
  }

  private getPatientMiddleName(patient: Patient): string {
    return patient?.nom && patient.nom !== 'O' ? patient.nom : '';
  }

  private getPatientLastName(patient: Patient): string {
    return patient?.postnom && patient.postnom !== 'O' ? patient.postnom : '';
  }

  setSelectedPatient(patient: Patient): void {
    this.dialog.close(patient);
  }

  getListHeaderText(): string {
    return this.data.entity === 'patient' ? 'Patients' : 'Agents';
  }

  close(): void {
    this.dialog.close();
  }
}
