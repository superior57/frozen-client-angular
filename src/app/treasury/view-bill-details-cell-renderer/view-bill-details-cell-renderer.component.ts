import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  IAfterGuiAttachedParams,
  ICellRendererParams,
} from 'ag-grid-community';
import { DocumentPreviewComponent } from 'src/app/common/document-preview/document-preview.component';
import { Document, DocumentModel } from 'src/app/home/model';

@Component({
  selector: 'app-view-bill-details-cell-renderer',
  templateUrl: './view-bill-details-cell-renderer.component.html',
  styleUrls: ['./view-bill-details-cell-renderer.component.scss'],
})
export class ViewBillDetailsCellRendererComponent
  implements ICellRendererAngularComp {
  value: Document;

  constructor(
    private documentModel: DocumentModel,
    private dialog: MatDialog
  ) {}

  agInit(params: ICellRendererParams): void {
    this.value = params.data;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  refresh(params: ICellRendererParams): boolean {
    this.value = params.data;
    return true;
  }

  openDocumentPreview(): void {
    this.dialog.open(DocumentPreviewComponent, {
      data: { document: this.value },
    });
  }

  setActiveDocument(): void {
    this.documentModel.active$.next(this.value);
  }
}
