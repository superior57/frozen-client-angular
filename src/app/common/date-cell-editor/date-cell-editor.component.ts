import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-date-cell-editor',
  templateUrl: './date-cell-editor.component.html',
  styleUrls: ['./date-cell-editor.component.scss'],
})
export class DateCellEditorComponent implements ICellEditorAngularComp {
  date: any;

  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  getValue() {
    return this.date;
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
    this.picker.open();
  }

  focusOut?(): void {
    this.picker.close();
  }

  getFrameworkComponentInstance?() {}

  agInit(params: ICellEditorParams): void {
    this.date = params.data?.date;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
}
