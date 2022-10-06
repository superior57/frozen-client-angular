import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestDataComponent } from './latest-data.component';

describe('LatestDataComponent', () => {
  let component: LatestDataComponent;
  let fixture: ComponentFixture<LatestDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LatestDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
