import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcritureTresorerieLabelCellEditorComponent } from './ecriture-tresorerie-label-cell-editor.component';

describe('EcritureTresorerieLabelCellEditorComponent', () => {
  let component: EcritureTresorerieLabelCellEditorComponent;
  let fixture: ComponentFixture<EcritureTresorerieLabelCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EcritureTresorerieLabelCellEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      EcritureTresorerieLabelCellEditorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
