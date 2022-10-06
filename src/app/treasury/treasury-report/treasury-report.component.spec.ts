import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryReportComponent } from './treasury-report.component';

describe('TreasuryReportComponent', () => {
  let component: TreasuryReportComponent;
  let fixture: ComponentFixture<TreasuryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
