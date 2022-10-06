import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-treasury-entry-justifier',
  templateUrl: './treasury-entry-justifier.component.html',
  styleUrls: ['./treasury-entry-justifier.component.scss'],
})
export class TreasuryEntryJustifierComponent {
  constructor(
    private dialog: MatDialogRef<TreasuryEntryJustifierComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  onSubmit(form: NgForm): void {}
}
