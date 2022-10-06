import { Component, HostBinding, ViewChild } from '@angular/core';
import { UserModel, User } from '../model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common';
import { MatPaginator } from '@angular/material/paginator';
import { UserCreateComponent } from '../user-create/user-create.component';
import {
  CellValueChangedEvent,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { UserListActionsComponent } from '../user-list-actions/user-list-actions.component';
import { map } from 'rxjs/operators';
import { UserRoleEditorComponent } from '../user-role-editor/user-role-editor.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  gridOptions$: Observable<GridOptions>;
  users$: Observable<User[]>;
  gridEditable$: Observable<boolean>;
  searchedUserName = '';
  isCollapsed = false;

  @HostBinding('class')
  ngClass = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public users: UserModel, private dialog: MatDialog) {
    this.users$ = users.filter({ children: 'roles|departements|credentials' });
    this.gridEditable$ = this.users.userHasRoles(['admin']);
    this.gridOptions$ = this.gridEditable$.pipe(
      map((editable) => {
        return this.createGridOptions(editable);
      })
    );
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.ngClass = this.isCollapsed ? 'collapsed' : '';
  }

  deleteUser(user: User): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          dataType: 'utlisateur',
        },
      })
      .afterClosed()
      .subscribe((deletetionConfirmed: boolean) => {
        if (deletetionConfirmed) {
          this.users.deleteOne(user);
        }
      });
  }

  openUserEditor(user: User): void {
    this.users.setUserUnderEdit(user);
    this.users.setIsUserCreationMode(false);

    this.dialog.open(UserCreateComponent, { data: { isEditMode: true } });
  }

  onGridReady(event: GridReadyEvent): void {}

  onCreateUser(): void {
    this.dialog.open(UserCreateComponent);
  }

  private createGridOptions(gridEditable: boolean): GridOptions {
    return {
      columnDefs: [
        { headerName: 'Nom', field: 'nom' },
        { headerName: 'Prénom', field: 'prenom' },
        { headerName: 'Identifiant', field: 'identifiant' },
        {
          headerName: 'Role',
          cellEditor: 'userRoleEditor',
          field: 'roles',
          valueFormatter: (params) => {
            const roles = (params.data as User)?.roles;
            if (roles && roles.length > 0) {
              return roles
                .map((role) => role.label)
                .reduce((p, c) => `${p}, ${c}`);
            }
            return '';
          },
        },
        {
          headerName: 'Mot de passe',
          valueFormatter: (params) => '****',
          valueGetter: (params) => params.data.credentials[0].password,
          valueSetter: (params) => {
            if (params.oldValue !== params.newValue) {
              params.data.credentials[0].password = params.newValue;
              return true;
            }
            return false;
          },
        },
        {
          width: 350,
          headerName: 'Actions',
          cellRenderer: 'userListActions',
          editable: false,
        },
      ],
      defaultColDef: {
        minWidth: 100,
        resizable: true,
        editable: gridEditable,
      },
      frameworkComponents: {
        userListActions: UserListActionsComponent,
        userRoleEditor: UserRoleEditorComponent,
      },
    };
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    let isValueChanged: boolean = false;

    if (event.colDef.field === 'roles') {
      const isNotSame =
        event.newValue !== event.oldValue &&
        (event.oldValue.length !== event.newValue.length ||
          event.oldValue.every((r) => event.newValue.includes(r)));

      isValueChanged = isNotSame;
    } else {
      isValueChanged = event.oldValue !== event.newValue;
    }

    if (isValueChanged) {
      const cellRenderer = event.api.getCellRendererInstances({
        rowNodes: [event.node],
      })[0];
      (cellRenderer as any)._componentRef.instance.onValueChanged();
    }
  }
}
