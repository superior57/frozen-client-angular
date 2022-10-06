import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsMenuComponent } from './departments-menu.component';

describe('DepartmentsMenuComponent', () => {
  let component: DepartmentsMenuComponent;
  let fixture: ComponentFixture<DepartmentsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
