import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseBillListComponent } from './expense-bill-list.component';

describe('ExpenseBillListComponent', () => {
  let component: ExpenseBillListComponent;
  let fixture: ComponentFixture<ExpenseBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseBillListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
