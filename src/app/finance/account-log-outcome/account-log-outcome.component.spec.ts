import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLogOutcomeComponent } from './account-log-outcome.component';

describe('AccountLogOutcomeComponent', () => {
  let component: AccountLogOutcomeComponent;
  let fixture: ComponentFixture<AccountLogOutcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLogOutcomeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLogOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
