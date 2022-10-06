import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryEntryJustifierComponent } from './treasury-entry-justifier.component';

describe('TreasuryEntryJustifierComponent', () => {
  let component: TreasuryEntryJustifierComponent;
  let fixture: ComponentFixture<TreasuryEntryJustifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreasuryEntryJustifierComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryEntryJustifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
