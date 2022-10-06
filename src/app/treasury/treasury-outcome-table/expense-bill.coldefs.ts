import { ColDef } from 'ag-grid-community';
import { Document } from 'src/app/home/model';

export const expenseBillColDefs: ColDef[] = [
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: 'dateCellRenderer',
    cellEditor: 'dateCellEditor',
  },
  {
    headerName: 'Service',
    valueGetter: (params) => getDepartementName(params.data),
    editable: false,
  },
  {
    headerName: 'Emis par',
    valueGetter: (params) => getUserFullName(params.data),
    editable: false,
  },
  {
    headerName: 'Montant total',
    valueGetter: (params) => getBillTotals(params.data),
    editable: false,
  },
  {
    headerName: 'Actions',
    cellRenderer: 'viewBillDetails',
  },
];

const getDepartementName = (bon: Document): string => {
  return bon?.departementOrigine?.label;
};

const getUserFullName = (bon: Document): string => {
  if (!bon?.emisPar) {
    return null;
  }

  const user = bon.emisPar;
  const fullName = `${user.nom || ''} ${user.postnom || ''} ${
    user.postnom || ''
  }`;
  return fullName.trim();
};

const getBillTotals = (bon: Document): string => {
  let lignesTotal: number;
  let lignesTresorerieTotal;

  if (!bon?.lignes || bon.lignes.length === 0) {
    lignesTotal = 0;
  } else {
    lignesTotal = bon.lignes
      .map((ligne) =>
        ligne.devise === 'CDF' ? ligne.montant / 2030 : ligne.montant
      )
      .reduce((p, c) => p + c);
  }

  if (!bon?.lignesTresorerie || bon.lignesTresorerie.length === 0) {
    lignesTresorerieTotal = 0;
  } else {
    lignesTresorerieTotal = bon.lignesTresorerie
      .map((ligne) =>
        ligne.devise === 'CDF' ? ligne.montant / 2030 : ligne.montant
      )
      .reduce((p, c) => p + c);
  }

  return Math.abs(lignesTotal + lignesTresorerieTotal).toFixed(2) + ' $US';
};
