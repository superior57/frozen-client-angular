import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillDetailsCellRendererComponent } from './view-bill-details-cell-renderer.component';

describe('ViewBillDetailsCellRendererComponent', () => {
  let component: ViewBillDetailsCellRendererComponent;
  let fixture: ComponentFixture<ViewBillDetailsCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBillDetailsCellRendererComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBillDetailsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
