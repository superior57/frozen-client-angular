import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionMenuComponent } from './reception-menu.component';

describe('ReceptionMenuComponent', () => {
  let component: ReceptionMenuComponent;
  let fixture: ComponentFixture<ReceptionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
