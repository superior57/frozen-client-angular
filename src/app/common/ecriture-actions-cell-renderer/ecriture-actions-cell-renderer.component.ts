import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
  RowNode,
  GridApi,
} from 'ag-grid-community';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { EcritureModel } from 'src/app/finance/model';
import { EcritureTresorerieModel, UserModel } from 'src/app/user/model';
import { ConfirmationDialogComponent } from '../confirmation-dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-ecriture-actions-cell-renderer',
  templateUrl: './ecriture-actions-cell-renderer.component.html',
  styleUrls: ['./ecriture-actions-cell-renderer.component.scss'],
})
export class EcritureActionsCellRendererComponent
  implements ICellRendererAngularComp {
  private isEcritureTresorerie: boolean = false;

  api: GridApi;
  ecriture: any;
  isDeletable$: Observable<boolean>;
  valueChanged: boolean = false;
  node: RowNode;

  constructor(
    userModel: UserModel,
    private dialog: MatDialog,
    private ecritureModel: EcritureModel,
    private ecritureTresorerieModel: EcritureTresorerieModel
  ) {
    this.isDeletable$ = userModel.activeUser.pipe(
      filter((u) => !!u),
      take(1),
      map((user) => user.roles.some((role) => role.label === 'admin'))
    );
  }

  refresh(params: ICellRendererParams): boolean {
    this.ecriture = params.data;
    this.node = params.node;
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.ecriture = params.data;
    this.node = params.node;
    this.api = params.api;

    const isEcritureTresorerie = (params as any).isEcritureTresorerie;

    if (isEcritureTresorerie != null && isEcritureTresorerie !== undefined) {
      this.isEcritureTresorerie = isEcritureTresorerie;
    }
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  onDeleteEcriture(): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message:
            'Etes-vous sûr de vouloir supprimer cette ecriture définitivement ?\nCette action ne peût être recouvrée.',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          let subscription: any;
          if (this.isEcritureTresorerie) {
            subscription = this.ecritureTresorerieModel.deleteOne(
              this.ecriture
            );
          } else {
            subscription = this.ecritureModel.deleteOne(this.ecriture);
          }

          subscription.subscribe(() => this.api.removeItems([this.node]));
        }
      });
  }

  onSaveEcriture(): void {
    let subscription: any;
    if (this.isEcritureTresorerie) {
      subscription = this.ecritureTresorerieModel.updateOne(this.ecriture);
    } else {
      subscription = this.ecritureModel.updateOne(this.ecriture);
    }

    subscription
      .pipe(
        catchError((e) => {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message: "Impossible d'enregistrer les modifications",
            },
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.valueChanged = false;
      });
  }

  onValueChanged(): void {
    this.valueChanged = true;
  }
}
