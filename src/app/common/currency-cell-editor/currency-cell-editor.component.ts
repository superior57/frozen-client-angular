import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-currency-cell-editor',
  templateUrl: './currency-cell-editor.component.html',
  styleUrls: ['./currency-cell-editor.component.scss'],
})
export class CurrencyCellEditorComponent implements ICellEditorAngularComp {
  currency: string;

  @ViewChild(MatSelect) currencySelector: MatSelect;

  getValue() {
    return this.currency;
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
    this.currencySelector.open();
  }

  focusOut?(): void {
    this.currencySelector.close();
  }

  getFrameworkComponentInstance?() {
    return this;
  }

  agInit(params: ICellEditorParams): void {
    this.currency = params.data?.devise;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onValueChange(): void {
    this.currencySelector.close();
  }
}
