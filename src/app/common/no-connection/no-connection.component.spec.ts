import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoConnectionComponent } from './no-connection.component';

describe('NoConnectionComponent', () => {
  let component: NoConnectionComponent;
  let fixture: ComponentFixture<NoConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoConnectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
