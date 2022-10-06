import { Overlay } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ConsultationComponent } from './consultation.component';

describe('ConsultationComponent', () => {
  let component: ConsultationComponent;
  let fixture: ComponentFixture<ConsultationComponent>;
  const dialogRef = {
    afterClose: () => of(true),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ConsultationComponent],
      providers: [MatDialog, Overlay, FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.get(MatDialog), 'open').and.callFake(() => dialogRef);
    spyOn(TestBed.get(FormBuilder), 'group').and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return valid diastolics number with valid tension data', () => {
    component.consultation.SignesVitaux.tension = '11/7';

    expect(component.diastolique).toEqual('11');
  });

  it('should return valid systolics number with valid tension data', () => {
    component.consultation.SignesVitaux.tension = '11/7';

    expect(component.systolique).toEqual('7');
  });

  it('should construct valid tension data when provided with diastolics and systolics', () => {
    component.diastolique = '20';
    component.systolique = '15';

    expect(component.consultation.SignesVitaux.tension).toEqual('20/15');
  });
});
