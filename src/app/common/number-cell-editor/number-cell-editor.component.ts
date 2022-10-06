import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-number-cell-editor',
  templateUrl: './number-cell-editor.component.html',
  styleUrls: ['./number-cell-editor.component.scss'],
})
export class NumberCellEditorComponent implements ICellEditorAngularComp {
  @ViewChild(MatInput) private input: MatInput;

  value: number = 0;

  getValue(): number {
    return this.value;
  }

  isPopup?(): boolean {
    return false;
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
    this.input.focus();
  }

  focusOut?(): void {}

  getFrameworkComponentInstance?() {
    return this;
  }

  agInit(params: ICellEditorParams): void {
    this.value = params.data.montant;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
}
