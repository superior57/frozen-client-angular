import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridReadyEvent, Optional } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Ecriture, TauxDeChange } from 'src/app/finance/model';
import { Document, DocumentModel } from 'src/app/home/model';
import { SessionModel } from '../model';
import { printCss } from './print';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss'],
})
export class DocumentPreviewComponent {
  private taux: TauxDeChange;

  readonly defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  } as ColDef;

  readonly colDefs: ColDef[] = [
    {
      checkboxSelection: true,
      maxWidth: 48,
      headerCheckboxSelection: true,
    },
    {
      headerName: 'Désignation',
      field: 'libele',
    },
    {
      headerName: 'Prix (USD)',
      field: 'montant',
      valueFormatter: (params) => {
        const value = params.value || 0;
        const amount =
          params.data?.devise == 'CDF' ? value / this.taux?.taux || 0 : value;
        return amount.toFixed(2) + ' US$';
      },
    },
    {
      headerName: 'Prix (CDF)',
      field: 'montant',
      valueFormatter: (params) => {
        const value = params.value || 0;
        const amount =
          params.data?.devise == 'USD' ? value * this.taux?.taux || 0 : value;
        return amount.toFixed(2) + ' CDF';
      },
    },
  ];

  @Input('document')
  inputDocument: Document;

  document$: Observable<Document>;

  constructor(
    sessionModel: SessionModel,
    @Optional() private dialog: MatDialogRef<DocumentPreviewComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: { document: Document },
    private documentModel: DocumentModel
  ) {
    sessionModel.tauxDeChange$
      .pipe(filter((t) => !!t))
      .subscribe((t) => (this.taux = t));

    if (this.data?.document) {
      this.document$ = of(this.data.document);
    } else {
      this.document$ = this.documentModel.active$.pipe(filter((d) => !!d));
    }
  }

  ngAfterViewInit(): void {
    if (this.inputDocument) {
      this.document$ = of(this.inputDocument);
    }
  }

  getFullPatientName(): Observable<string> {
    return this.document$.pipe(
      filter((d) => !!d.client),
      map((document) => {
        const patient = document.client;
        if (patient) {
          return `${patient.nom || ''} ${patient.postnom || ''} ${
            patient.prenom || ''
          }`.trim();
        }
        return '';
      })
    );
  }

  getUserFullName(): Observable<string> {
    return this.document$.pipe(
      filter((d) => !!d),
      map((document) => {
        const user = document.emisPar;

        if (user) {
          return `${user.nom || ''} ${user.postnom || ''} ${
            user.prenom || ''
          }`.trim();
        }
        return '';
      })
    );
  }

  getCurrentExchangeRateValue(): number {
    return this.taux?.taux;
  }

  getInvoiceValueAsCDF(): Observable<string> {
    return this.document$.pipe(
      filter((d) => !!d),
      map((document) => {
        const lignes = document.lignes;
        if (lignes && lignes.length > 0) {
          const value = lignes
            .map(
              (l) =>
                (l.devise === 'USD'
                  ? l.montant * this.taux?.taux || 0
                  : l.montant) * -1
            )
            .reduce((p, c) => p + c);
          return (value < 0 ? value * -1 : value).toFixed(2);
        }
        return '0';
      })
    );
  }

  onGridReady(event: GridReadyEvent): void {}

  getDocumentLignes(): Observable<Ecriture[]> {
    return this.document$.pipe(
      filter((d) => !!d),
      map((document) => document.lignes)
    );
  }

  print(): void {}

  close(): void {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  getDocumentTotal(): Observable<number> {
    return this.document$.pipe(
      filter((d) => !!d),
      map((document) => {
        if (document.lignes && document.lignes.length > 0) {
          const total = document.lignes
            .map((ligne) =>
              ligne.devise === 'CDF'
                ? ligne.montant / this.taux.taux
                : ligne.montant
            )
            .reduce((p, c) => p + c);
          return total < 0 ? total * -1 : total;
        }

        return 0;
      })
    );
  }

  printInvoice(preview: HTMLDivElement): void {
    const frame = document.createElement('iframe');
    frame.src = 'about:blank';
    frame.onload = () => {
      frame.contentWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
          <head>
          </head>
          <body>
            <style media="print,screen">${printCss}</style>
            <div class="invoice-preview">
              ${preview.innerHTML}
            </div>
            <script>

              function printInvoice() { window.focus(); window.print(); }
            </script>
          </body>
        </html>
      `);
      frame.width = '1px';
      frame.height = '1px';

      setTimeout(() => {
        frame.focus();
        (frame.contentWindow as any).printInvoice();
        frame.parentElement.removeChild(frame);
      });
    };
    document.body.appendChild(frame);
  }

  getPatientFullName(): Observable<string> {
    return this.document$.pipe(
      filter((d) => !!d),
      map((document) => {
        const patient = document.client;

        if (patient) {
          return `${patient?.nom || ''} ${patient?.postnom || ''} ${
            patient?.prenom || ''
          }`;
        }
        return '';
      })
    );
  }

  getLigneMontant(ligne: Ecriture): number {
    const montant =
      ligne.devise === 'CDF' ? ligne.montant / this.taux.taux : ligne.montant;

    return montant < 0 ? montant * -1 : montant;
  }
}
