import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderCellEditorComponent } from './gender-cell-editor.component';

describe('GenderCellEditorComponent', () => {
  let component: GenderCellEditorComponent;
  let fixture: ComponentFixture<GenderCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenderCellEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
