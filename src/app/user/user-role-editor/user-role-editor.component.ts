import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Role, User } from '../model';

@Component({
  selector: 'app-user-role-editor',
  templateUrl: './user-role-editor.component.html',
  styleUrls: ['./user-role-editor.component.scss'],
})
export class UserRoleEditorComponent implements ICellEditorAngularComp {
  private userRoles: Role[];
  private params: ICellEditorParams;

  user: User;
  roles: string[] = ['chef-departement', 'admin', 'encodeur', 'partenaire'];

  getValue() {
    return this.userRoles;
  }

  isPopup?(): boolean {
    return true;
  }

  onRoleChanged(selected: MatCheckboxChange, role: string): void {
    if (selected.checked) {
      this.userRoles.push({ label: role, utilisateur: this.user.identifiant });
    } else {
      const positionToRemove = this.user.roles.findIndex(
        (r) => r.label === role
      );
      this.userRoles.splice(positionToRemove, 1);
    }
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

  focusIn?(): void {}

  focusOut?(): void {}

  getFrameworkComponentInstance?() {
    return this;
  }

  agInit(params: ICellEditorParams): void {
    this.user = params.data;
    this.params = params;
    this.userRoles = this.user.roles.map((role) => ({ ...role }));
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  closePopup(): void {
    this.params.stopEditing();
  }

  isRoleAssignedToUser(role: string): boolean {
    return this.user.roles.some((r) => r.label === role);
  }
}
