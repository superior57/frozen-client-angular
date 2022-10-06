import { Component } from '@angular/core';
import { CellValueChangedEvent, ColDef, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DateCellEditorComponent } from 'src/app/common/date-cell-editor/date-cell-editor.component';
import { DateCellRendererComponent } from 'src/app/common/date-cell-renderer/date-cell-renderer.component';
import { UserModel } from 'src/app/user';
import { GenderCellEditorComponent } from '../gender-cell-editor/gender-cell-editor.component';
import { Patient, PatientModel } from '../model';
import { PatientListActionComponent } from '../patient-list-action/patient-list-action.component';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent {
  gridOptions$: Observable<GridOptions>;
  patients$: Observable<Patient[]>;

  constructor(patientModel: PatientModel, userModel: UserModel) {
    this.patients$ = patientModel.filter({ sort: '-createdAt' });
    this.gridOptions$ = userModel.activeUser.pipe(
      filter((u) => !!u),
      map((user) => {
        return !user.roles.some((role) => role.label === 'partenaire');
      }),
      map((editable) => this.createGridOptions(editable))
    );
  }

  private createGridOptions(gridEditable: boolean): GridOptions {
    return {
      columnDefs: [
        {
          headerName: 'id',
          field: 'id',
          editable: false,
        },
        {
          headerName: `Date d'enregistrement`,
          field: 'dateEnregistrement',
          cellRenderer: 'dateCellRenderer',
          cellEditor: 'dateCellEditor',
        },
        {
          headerName: 'Prenom',
          field: 'prenom',
        },
        {
          headerName: 'Nom',
          field: 'nom',
        },
        {
          headerName: 'Post nom',
          field: 'postnom',
        },
        {
          headerName: 'Sexe',
          field: 'sexe',
          cellEditor: 'genderEditor',
          valueFormatter: (params) => {
            if (params.data?.sexe === 'F') {
              return 'Féminin';
            } else if (params.data?.sexe === 'H') {
              return 'Masculin';
            }
          },
        },
        {
          headerName: 'Catégorie',
          field: 'categorie',
        },
        {
          headerName: 'Actions',
          cellRenderer: 'patientListActions',
          editable: false,
          width: 350,
        },
      ],
      frameworkComponents: {
        patientListActions: PatientListActionComponent,
        genderEditor: GenderCellEditorComponent,
        dateCellRenderer: DateCellRendererComponent,
        dateCellEditor: DateCellEditorComponent,
      },
      defaultColDef: {
        editable: gridEditable,
      },
    };
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const isValueChanged = event.newValue !== event.oldValue;

    if (isValueChanged) {
      const cellRenderer = event.api.getCellRendererInstances({
        rowNodes: [event.node],
      })[0];
      (cellRenderer as any)._componentRef.instance.onValueChanged();
    }
  }
}
