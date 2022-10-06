import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCellEditorComponent } from './number-cell-editor.component';

describe('NumberCellEditorComponent', () => {
  let component: NumberCellEditorComponent;
  let fixture: ComponentFixture<NumberCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumberCellEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
