import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLineItemComponent } from './new-line-item.component';

describe('NewLineItemComponent', () => {
  let component: NewLineItemComponent;
  let fixture: ComponentFixture<NewLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewLineItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
