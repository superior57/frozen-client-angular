import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent {
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialogRef<InfoDialogComponent>
  ) {
    this.message = data.message;
  }

  dismiss(): void {
    this.dialog.close();
  }
}
