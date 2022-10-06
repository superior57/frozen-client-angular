import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { DepartmentModel } from '../common/model';
import { PatientSearchDialogComponent } from '../home/patient-search-dialog/patient-search-dialog.component';
import { User, UserModel } from '../user';
import { Consultation, ConsultationsModel } from './models';
import { PrescriptionDialogComponent } from './prescription-dialog/prescription-dialog.component';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss'],
})
export class ConsultationComponent {
  patientFormGroup: FormGroup;
  nursingFormGroup: FormGroup;
  consultationFormGroup: FormGroup;

  get diastolique(): string {
    const tension: string = this.consultations.active$.value.SignesVitaux.tension;
    return tension?.substring(0, tension.indexOf('/')) || '';
  }

  set diastolique(value: string) {
    this.consultations.active$.value.SignesVitaux.tension = `${value}/${
      this.systolique || ''
    }`;
  }

  get systolique(): string {
    const tension: string = this.consultations.active$.value.SignesVitaux.tension;

    return tension?.substring(tension.indexOf('/') + 1, tension.length) || '';
  }

  set systolique(value: string) {
    this.consultations.active$.value.SignesVitaux.tension = `${
      this.systolique || ''
    }/${value}}`;
  }

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private departments: DepartmentModel,
    private users: UserModel,
    public consultations: ConsultationsModel,
  ) {
    
  }

  ngOnInit(): void {
    this.patientFormGroup = this.formBuilder.group({
      patientId: ['', Validators.required],
    });

    this.nursingFormGroup = this.formBuilder.group({});

    this.consultationFormGroup = this.formBuilder.group({});
  }

  onPatientAdd(): boolean {
    this.dialog
      .open(PatientSearchDialogComponent, {
        data: {
          entity: 'patient',
        },
      })
      .afterClosed()
      .subscribe((patient) => {
        if (patient) {
          this.consultations.active$.value.Patient = patient;
          this.consultations.active$.value.patient = patient.id;
        }
      });

    return false;
  }

  onButtonClick(): boolean {
    return false;
  }

  onAddPrescriptionClick(): void {
    this.dialog.open(PrescriptionDialogComponent);
  }

  onSendToNursingClick(): void {
    combineLatest([
      this.departments.selected$.pipe(take(1)),
      this.users.activeUser.pipe(take(1)),
    ])
      .pipe(
        switchMap(([department, user]) => {
          return this.createOrUpdate(department.id, user);
        }),
        switchMap(() => EMPTY)
      )
      .subscribe(() => {});
  }

  private createOrUpdate(departmentId: number, _user: User): Observable<Consultation> {
    if (!!this.consultations.active$.value.id) {
      return this.consultations
        .update()
        .pipe(tap((consultation: Consultation) => {
          this.updateConsultation(consultation);
        }));
    }

    this.consultations.active$.value.departement = departmentId;

    return this.consultations
      .create()
      .pipe(tap((consultation: Consultation) => {
        this.updateConsultation(consultation);
      }));
  }

  private updateConsultation(consultation: Consultation): void {
    const updatedConsultation = {
      SignesVitaux: {
        symptomes: '',
        tension: '',
        imc: '',
        date: new Date().toLocaleDateString('fr'),
      },
      ...consultation
    };
    
    this.consultations.active$.next(updatedConsultation);
  }

  onSendToConsultationClick(): void {
    this.consultations
      .update()
      .subscribe((consultation: Consultation) => {
        this.updateConsultation(consultation);
      });
  }
}
