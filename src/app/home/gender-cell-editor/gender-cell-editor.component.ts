import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-gender-cell-editor',
  templateUrl: './gender-cell-editor.component.html',
  styleUrls: ['./gender-cell-editor.component.scss'],
})
export class GenderCellEditorComponent implements ICellEditorAngularComp {
  gender: string;

  @ViewChild(MatSelect) genderSelector: MatSelect;

  getValue() {
    return this.gender;
  }

  isPopup?(): boolean {
    return true;
  }

  getPopupPosition?(): string {
    return '0';
  }

  isCancelBeforeStart?(): boolean {
    return false;
  }

  isCancelAfterEnd?(): boolean {
    return false;
  }

  focusIn?(): void {
    this.genderSelector.open();
  }

  focusOut?(): void {
    this.genderSelector.close();
  }

  getFrameworkComponentInstance?() {
    return this;
  }

  agInit(params: ICellEditorParams): void {
    this.gender = params.data?.sexe;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onValueChange(): void {
    this.genderSelector.close();
  }
}
