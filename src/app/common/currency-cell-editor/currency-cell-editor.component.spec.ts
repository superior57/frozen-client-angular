import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyCellEditorComponent } from './currency-cell-editor.component';

describe('CurrencyCellEditorComponent', () => {
  let component: CurrencyCellEditorComponent;
  let fixture: ComponentFixture<CurrencyCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyCellEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
