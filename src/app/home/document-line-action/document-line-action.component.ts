import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
  GridApi,
  RowNode,
} from 'ag-grid-community';
import { Ecriture } from 'src/app/finance/model';
import { NewLineItemComponent } from '../new-line-item/new-line-item.component';

@Component({
  selector: 'app-document-line-action',
  templateUrl: './document-line-action.component.html',
  styleUrls: ['./document-line-action.component.scss'],
})
export class DocumentLineActionComponent implements ICellRendererAngularComp {
  private api: GridApi;
  private data: Ecriture;
  private node: RowNode;

  constructor(private dialog: MatDialog) {}

  refresh(params: any): boolean {
    this.api = params.api;
    this.data = params.data;
    this.node = params.node;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.api = params.api;
    this.data = params.data;
    this.node = params.node;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onDeleteEcriture(): boolean {
    this.api.removeItems([this.node]);
    return false;
  }
}
