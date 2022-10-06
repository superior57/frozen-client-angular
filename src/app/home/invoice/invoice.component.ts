import { Component, HostBinding } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { DocumentPreviewComponent } from 'src/app/common/document-preview/document-preview.component';
import { DepartmentModel, SessionModel } from 'src/app/common/model';
import { Ecriture, TauxDeChange } from 'src/app/finance/model';
import { UserModel } from 'src/app/user';
import {
  Document,
  DocumentModel,
  DocumentType,
  Patient,
  PatientModel,
} from '../model';
import { NewLineItemComponent } from '../new-line-item/new-line-item.component';
import { NewBillEntryComponent } from '../new-bill-entry/new-bill-entry.component';
import { ErrorDialogComponent } from 'src/app/common/error-dialog/error-dialog.component';
import { InfoDialogComponent } from 'src/app/common/info-dialog/info-dialog.component';
import { PatientSearchDialogComponent } from '../patient-search-dialog/patient-search-dialog.component';
import { DocumentLineActionComponent } from '../document-line-action/document-line-action.component';
import { ThrowStmt } from '@angular/compiler';
import { CurrencyCellEditorComponent } from '../../common/currency-cell-editor/currency-cell-editor.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  private selectedDepartment: number;
  private api: GridApi;
  private taux: TauxDeChange;

  gridOptions: GridOptions = {
    frameworkComponents: {
      documentLineAction: DocumentLineActionComponent,
      currencyCellEditor: CurrencyCellEditorComponent,
    },
    defaultColDef: {
      resizable: true,
      editable: true,
    },
    columnDefs: [
      {
        headerName: 'Désignation',
        field: 'libele',
      },
      {
        headerName: 'Devise',
        field: 'devise',
        cellEditor: 'currencyCellEditor',
      },
      {
        headerName: 'Prix',
        field: 'montant',
        valueFormatter: (params) => {
          const value = Math.abs(params.value || 0);
          return value.toFixed(2);
        },
      },
      {
        headerName: 'Actions',
        cellRenderer: 'documentLineAction',
        width: 300,
        editable: false,
      },
    ],
  };

  isAllRowsSelected: boolean = false;
  selectedEntries: Ecriture[] = [];
  ecritures: Ecriture[] = [];
  patient: Patient;
  invoice: Document;

  quoteMode$: Observable<boolean>;

  @HostBinding('class') ngClass: string;

  constructor(
    private userModel: UserModel,
    private dialog: MatDialog,
    private router: Router,
    private documentModel: DocumentModel,
    private route: ActivatedRoute,
    private sessionModel: SessionModel,
    private departmentModel: DepartmentModel,
    private patientModel: PatientModel
  ) {
    this.resetInvoice();

    sessionModel.tauxDeChange$
      .pipe(filter((t) => !!t))
      .subscribe((t) => (this.taux = t));

    this.quoteMode$ = this.route.params.pipe(
      take(1),
      map((params) => params.mode === 'facture'),
      tap(
        (isQuote) =>
          (this.invoice.type = isQuote
            ? DocumentType.FACTURE
            : DocumentType.BON)
      )
    );

    const routeParams$ = this.route.queryParamMap.pipe(take(1));
    const departements$ = this.departmentModel.list$.pipe(filter((d) => !!d));

    combineLatest([routeParams$, departements$])
      .pipe(take(1))
      .subscribe(([params, departements]) => {
        this.selectedDepartment = parseInt(params.get('departmentId'));
        this.invoice.departement = this.selectedDepartment;
        this.invoice.departementOrigine = departements.find(
          (d) => d.id === this.selectedDepartment
        );
        this.invoice.gratuit = params.get('freeQuote') === 'true';

        if (this.invoice.gratuit) {
          this.ngClass = 'free-quote';
        }
      });

    this.userModel.activeUser.pipe(filter((u) => !!u)).subscribe((user) => {
      this.invoice.operateur = user.identifiant;
      this.invoice.emisPar = user;
    });
  }

  private resetInvoice(): void {
    this.invoice = {
      date: new Date(),
      departement: null,
      id: undefined,
      lignes: [],
      operateur: null,
      patient: null,
      gratuit: false,
      type: DocumentType.FACTURE,
    };

    if (this.patientModel.underEdit) {
      this.patient = this.patientModel.underEdit;
      this.invoice.client = this.patientModel.underEdit;
    }
  }

  onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
  }

  onNewEntry(ecriture: Ecriture): void {
    if (ecriture) {
      if (this.invoice.gratuit) {
        ecriture.ecart = ecriture.montant;
      } else {
        ecriture.ecart = 0;
      }
      this.api.addItems([ecriture]);
    }
  }

  submitQuote(form: NgForm): void {
    if (
      this.invoice.type === DocumentType.FACTURE &&
      !this.invoice.client?.id
    ) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Le nom du patient doit être renseigné' },
      });
      return;
    }

    if (form.valid) {
      this.userModel.activeUser
        .pipe(
          take(1),
          switchMap((user) => {
            this.api.forEachNode((node) => this.ecritures.push(node.data));
            this.invoice.lignes = this.ecritures;

            if (this.invoice.lignes?.length === 0) {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Impossible de valider un document vide' },
              });
              return EMPTY;
            }

            this.invoice.operateur = user.identifiant;
            this.invoice.patient = this.invoice.client?.id;
            return this.documentModel.save(this.invoice);
          })
        )
        .pipe(
          catchError((e) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Impossible sauvegarder la facture' },
            });
            console.error(e);
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.dialog
            .open(InfoDialogComponent, {
              data: { message: 'Facture créée avec succès' },
            })
            .afterClosed()
            .subscribe(() => {
              form.resetForm();
              this.navigateBack();
              this.resetInvoice();
              this.patientModel.underEdit = null;
            });
        });
    }
  }

  navigateBack(): void {
    this.router.navigateByUrl('/reception');
  }

  deleteSelected(): boolean {
    const selectedNodes = this.api.getSelectedNodes();

    selectedNodes.forEach((node) => {
      this.ecritures.splice(
        this.ecritures.findIndex((e) => e.id === node.data.id)
      );
    });
    this.api.removeItems(selectedNodes);
    return false;
  }

  clearAllRows(): boolean {
    this.api.selectAll();
    this.api.removeItems(this.api.getSelectedNodes());
    return false;
  }

  addProductOrService(): boolean {
    this.dialog
      .open(NewLineItemComponent, {
        data: { departmentId: this.selectedDepartment },
      })
      .afterClosed()
      .subscribe((item) => this.onNewEntry(item));
    return false;
  }

  getUserFullName(): Observable<string> {
    return this.userModel.activeUser.pipe(
      filter((u) => !!u),
      map((user) => {
        let fullName = user.nom || '' + ' ';
        fullName += user.postnom || '' + ' ';
        fullName += user.prenom || '';
        return fullName.trim();
      })
    );
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getPatientFullName(): string {
    return `${this.patient?.nom || ''} ${this.patient?.postnom || ''} ${
      this.patient?.prenom || ''
    }`;
  }

  getCurrentExchangeRateValue(): Observable<number> {
    return this.sessionModel.tauxDeChange$.pipe(
      filter((t) => !!t),
      map((t) => t.taux)
    );
  }

  getInvoiceValueAsCDF(): Observable<number> {
    return this.sessionModel.tauxDeChange$.pipe(
      filter((t) => !!t),
      map((taux) => {
        return this.ecritures.length === 0
          ? 0
          : this.ecritures
              .map((e) => {
                if (e.devise === 'CDF') {
                  return e.montant;
                } else {
                  return e.montant * taux.taux;
                }
              })
              .reduce((p, c) => p + c);
      })
    );
  }

  openInvoicePreview(): boolean {
    this.invoice.lignes.splice(0, this.invoice.lignes.length);
    this.api.forEachNode((node) => {
      this.invoice.lignes.push(node.data);
    });
    this.invoice.client = this.patient;
    this.invoice.patient = this.patient?.id;

    this.dialog.open(DocumentPreviewComponent, {
      data: { document: this.invoice },
    });
    return false;
  }

  onAddNewBillLine(): boolean {
    this.dialog
      .open(NewBillEntryComponent, {
        data: { document: this.invoice },
      })
      .afterClosed()
      .subscribe((entry) => {
        if (entry) {
          this.onNewEntry(entry);
        }
      });
    return false;
  }

  canDisplayInvoicePreviewButton(): boolean {
    return this.invoice.client === undefined || this.invoice.client == null;
  }

  onPatientAdd(): boolean {
    this.dialog
      .open(PatientSearchDialogComponent, {
        data: {
          entity: 'patient',
        },
      })
      .afterClosed()
      .subscribe((patient) => {
        if (patient) {
          this.patient = patient;
          this.invoice.client = patient;
          this.invoice.patient = patient.id;
        }
      });
    return false;
  }

  onAgentAdd(): boolean {
    this.dialog
      .open(PatientSearchDialogComponent, {
        data: {
          entity: 'agent',
        },
      })
      .afterClosed()
      .subscribe((agent) => {
        if (agent) {
          this.invoice.recommandePar = agent;
          this.invoice.recommandeur = agent.id;
        }
      });

    return false;
  }
}
