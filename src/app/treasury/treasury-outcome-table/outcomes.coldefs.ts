import { LOCALE_ID } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { compareDates, getQueryDateOrDateRange } from 'src/app/common';
import { AccountingPeriod, Ecriture } from 'src/app/finance/model';
import { Compte, EcritureRepartition } from '../model';

export const makeOutcomeColDefs = (
  period: AccountingPeriod,
  ecritures: EcritureRepartition[]
): ColDef[] => {
  return [
    {
      headerName: 'Rubrique',
      field: 'intitule',
    },
    {
      headerName: 'Disponibilité',
      valueGetter: (params) =>
        getAccountBalanceForSelectedPeriod(params.data, period, ecritures),
      valueFormatter: (params) => params.value?.toFixed(2) + ' $US',
    },
    {
      headerName: 'Sorties',
      field: 'cumulSorties',
      editable: true,
      valueSetter: (params) =>
        (params.data.cumulSorties =
          (params.newValue || 0) + (params.oldValue || 0)),
    },
    {
      headerName: 'Dernière date de sortie',
      field: 'derniereDateSortie',
      valueGetter: (params) => getLatestEcritureTresorerieDate(params.data),
      valueFormatter: (params) =>
        (params.value as Date)?.toLocaleDateString(LOCALE_ID.toString()) ||
        'N/A',
    },
    {
      headerName: 'Solde',
      valueGetter: (params) =>
        getAccountBalanceForSelectedPeriod(params.data, period, ecritures),
      valueFormatter: (params) => params.value?.toFixed(2) + ' US$',
    },
  ];
};

const getLatestEcritureTresorerieDate = (compte: Compte): Date => {
  if (!compte || compte.ecrituresTresorerie.length === 0) {
    return null;
  }

  return compte.ecrituresTresorerie.sort((first, second) =>
    compareDates(first.date, second.date)
  )[0].date;
};

const getAccountBalanceForSelectedPeriod = (
  compte: Compte,
  period: AccountingPeriod,
  ecritures: EcritureRepartition[]
): number => {
  const dates = getQueryDateOrDateRange(period);
  const date = new Date(dates[0]);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const filteredEcritures = ecritures.filter((e) => e.compte === compte.id);
  return filteredEcritures.length > 0
    ? filteredEcritures
        .map((e) => e.montant)
        .reduce((previous, current) => previous + current)
    : 0;
};
