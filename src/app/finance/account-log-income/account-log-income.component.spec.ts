import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLogIncomeComponent } from './account-log-income.component';

describe('AccountLogIncomeComponent', () => {
  let component: AccountLogIncomeComponent;
  let fixture: ComponentFixture<AccountLogIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLogIncomeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLogIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
