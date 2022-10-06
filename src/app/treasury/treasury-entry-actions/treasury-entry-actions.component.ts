import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from 'ag-grid-community';
import { DetailsEcriture } from 'src/app/finance/model';
import { EcritureTresorerie, TreasuryEntry } from '../model';

@Component({
  selector: 'app-treasury-entry-actions',
  templateUrl: './treasury-entry-actions.component.html',
  styleUrls: ['./treasury-entry-actions.component.scss'],
})
export class TreasuryEntryActionsComponent implements ICellRendererAngularComp {
  ecriture: EcritureTresorerie;
  detail: DetailsEcriture;

  constructor() {}

  refresh(params: any): boolean {
    this.ecriture = params.data;
    this.detail = this.ecriture.detail;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.ecriture = params.data;
    this.detail = this.ecriture.detail;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  shouldDisplayButton(): boolean {
    return (
      this.ecriture.montantSysteme != this.ecriture.montant &&
      this.ecriture.date.toString() !== 'Totaux'
    );
  }
}
