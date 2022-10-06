import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcritureActionsCellRendererComponent } from './ecriture-actions-cell-renderer.component';

describe('EcritureActionsCellRendererComponent', () => {
  let component: EcritureActionsCellRendererComponent;
  let fixture: ComponentFixture<EcritureActionsCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EcritureActionsCellRendererComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcritureActionsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
