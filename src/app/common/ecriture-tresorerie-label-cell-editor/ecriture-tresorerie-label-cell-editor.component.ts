import { Component, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Departement } from 'src/app/user';
import { DepartmentModel } from '../model';

@Component({
  selector: 'app-ecriture-tresorerie-label-cell-editor',
  templateUrl: './ecriture-tresorerie-label-cell-editor.component.html',
  styleUrls: ['./ecriture-tresorerie-label-cell-editor.component.scss'],
})
export class EcritureTresorerieLabelCellEditorComponent
  implements ICellEditorAngularComp {
  departements$: Observable<Departement[]>;
  libele: string;

  @ViewChild(MatSelect) private libeleSelector: MatSelect;

  constructor(departmentModel: DepartmentModel) {
    this.departements$ = departmentModel.list$.pipe(filter((d) => !!d));
  }

  getValue(): string {
    return this.libele;
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
    this.libeleSelector.open();
  }

  focusOut?(): void {
    this.libeleSelector.close();
  }

  getFrameworkComponentInstance?() {
    return this;
  }

  agInit(params: ICellEditorParams): void {
    this.libele = params.data.libele;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  getDepartementOption(departement: Departement): string {
    if (departement.intitule.toLowerCase() === 'officine') {
      return `Versement - ${departement.label.toLowerCase()}`;
    }

    return `Versement - ${departement.intitule.toLowerCase()}`;
  }
}
