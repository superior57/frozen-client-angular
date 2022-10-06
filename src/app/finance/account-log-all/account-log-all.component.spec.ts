import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLogAllComponent } from './account-log-all.component';

describe('AccountLogAllComponent', () => {
  let component: AccountLogAllComponent;
  let fixture: ComponentFixture<AccountLogAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLogAllComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLogAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
