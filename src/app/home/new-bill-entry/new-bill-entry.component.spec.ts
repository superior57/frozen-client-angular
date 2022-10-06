import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillEntryComponent } from './new-bill-entry.component';

describe('NewBillEntryComponent', () => {
  let component: NewBillEntryComponent;
  let fixture: ComponentFixture<NewBillEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewBillEntryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
