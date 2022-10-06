import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
  GridApi,
  RowNode,
} from 'ag-grid-community';
import { EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { WarningDialogComponent } from 'src/app/common/warning-dialog/warning-dialog.component';
import { User, UserModel } from '../model';

@Component({
  selector: 'app-user-list-actions',
  templateUrl: './user-list-actions.component.html',
  styleUrls: ['./user-list-actions.component.scss'],
})
export class UserListActionsComponent implements ICellRendererAngularComp {
  private user: User;
  private api: GridApi;
  private node: RowNode;

  isValueChanged: boolean = false;

  constructor(
    private dialog: MatDialog,
    private userModel: UserModel,
    private snack: MatSnackBar
  ) {}

  refresh(params: any): boolean {
    this.user = params.data;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.user = params.data;
    this.node = params.node;
    this.api = params.api;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onDeleteUser(): void {
    this.dialog
      .open(WarningDialogComponent, {
        data: {
          message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
        },
      })
      .afterClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.api.removeItems([this.node]);
            return this.userModel.deleteOne(this.user);
          }
          return EMPTY;
        })
      )
      .subscribe((e) => {});
  }

  onValueChanged(): void {
    this.isValueChanged = true;
  }

  onSaveUser(): void {
    this.userModel
      .updateOne(this.user)
      .pipe(
        catchError((e) => {
          this.snack.open("Impossible d'enregistrer les modifications", 'Ok');
          return EMPTY;
        })
      )
      .subscribe((user) => {
        this.isValueChanged = false;
      });
  }
}
