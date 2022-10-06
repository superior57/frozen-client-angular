import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Patient, PatientModel } from '../model';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
})
export class PatientSearchComponent implements OnDestroy {
  searchedPatients$: Observable<Patient[]>;
  displayDropdown = false;
  selectedPatient: Patient;
  disablePatientChange: boolean = false;

  @Input()
  value: any;

  @Output() valueChange: EventEmitter<Patient> = new EventEmitter(null);

  constructor(private patients: PatientModel) {
    this.patients.patient$.pipe(filter((p) => !!p)).subscribe((patient) => {
      this.selectedPatient = patient;
      this.disablePatientChange = true;
      this.valueChange.emit(patient);
    });
  }
  ngOnDestroy(): void {
    this.patients.patient$.next(null);
  }

  onPatientNameChange(value: string): void {
    if (value?.length > 0) {
      this.displayDropdown = true;
      this.searchedPatients$ = this.patients.search(value).pipe(take(1));
    }
  }

  setActivePatient(patient: Patient): void {
    this.valueChange.emit(patient);
    this.selectedPatient = patient;
    this.displayDropdown = false;
  }

  getSelectedPatientFullName(): string {
    return this.selectedPatient
      ? `${this.selectedPatient.nom || ''} ${
          this.selectedPatient.postnom || ''
        } ${this.selectedPatient.prenom || ''}`
      : null;
  }

  getPatientName(patient: Patient): string {
    return `${patient?.nom || ''} ${patient?.postnom || ''} ${
      patient?.prenom || ''
    }`;
  }

  onBlur(): void {
    this.displayDropdown = false;
  }

  submit(form: NgForm): void {}
}
