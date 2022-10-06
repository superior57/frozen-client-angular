import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from 'ag-grid-community';

@Component({
  selector: 'app-date-cell-renderer',
  templateUrl: './date-cell-renderer.component.html',
  styleUrls: ['./date-cell-renderer.component.scss'],
})
export class DateCellRendererComponent implements ICellRendererAngularComp {
  date: any;

  refresh(params: any): boolean {
    this.date = params.date?.date;
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.date = params.data?.date;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
}
