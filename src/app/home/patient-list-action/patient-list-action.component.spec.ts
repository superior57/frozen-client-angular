import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListActionComponent } from './patient-list-action.component';

describe('PatientListActionComponent', () => {
  let component: PatientListActionComponent;
  let fixture: ComponentFixture<PatientListActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientListActionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
