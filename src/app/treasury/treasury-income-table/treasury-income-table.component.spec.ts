import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryIncomeTableComponent } from './treasury-income-table.component';

describe('TreasuryIncomeTableComponent', () => {
  let component: TreasuryIncomeTableComponent;
  let fixture: ComponentFixture<TreasuryIncomeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryIncomeTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryIncomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
