import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryEntryFormComponent } from './treasury-entry-form.component';

describe('TreasuryEntryFormComponent', () => {
  let component: TreasuryEntryFormComponent;
  let fixture: ComponentFixture<TreasuryEntryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryEntryFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
