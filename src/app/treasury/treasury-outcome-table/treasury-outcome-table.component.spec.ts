import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryOutcomeTableComponent } from './treasury-outcome-table.component';

describe('TreasuryOutcomeTableComponent', () => {
  let component: TreasuryOutcomeTableComponent;
  let fixture: ComponentFixture<TreasuryOutcomeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryOutcomeTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryOutcomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
