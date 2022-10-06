import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryEntryActionsComponent } from './treasury-entry-actions.component';

describe('TreasuryEntryActionsComponent', () => {
  let component: TreasuryEntryActionsComponent;
  let fixture: ComponentFixture<TreasuryEntryActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryEntryActionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryEntryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
