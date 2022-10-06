import { LOCALE_ID } from '@angular/core';
import { AccountingPeriod } from 'src/app/finance/model/accounting-period';
import { AccountingPeriodType } from 'src/app/finance/model/accounting-period-type';

const DEFAULT_DATE_LOCALE = 'fr-FR';

export const getFirstDateOfMonth = (month: number, year: number): Date => {
  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (month: number, year: number): Date => {
  switch (month + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return new Date(year, month, 31);
    case 2:
      const isBixextile = (year - 2020) % 4 == 0;
      return new Date(year, month, isBixextile ? 29 : 28);
    default:
      return new Date(year, month, 30);
  }
};

export const getQueryDateOrDateRange = (
  period: AccountingPeriod
): string | string[] => {
  if (period.type === AccountingPeriodType.Journalier) {
    return [
      `${period.selectedDate.getFullYear()}/${
        period.selectedDate.getMonth() + 1
      }/${period.selectedDate.getDate()} 00:00`,
      `${period.selectedDate.getFullYear()}/${
        period.selectedDate.getMonth() + 1
      }/${period.selectedDate.getDate()} 23:00`,
    ];
  } else if (period.type === AccountingPeriodType.Mensuel) {
    const firstDate = getFirstDateOfMonth(
      period.selectedMonth,
      period.selectedYear
    );
    const lastDate = getLastDayOfMonth(
      period.selectedMonth,
      period.selectedYear
    );
    return [
      `${firstDate.getFullYear()}/${
        firstDate.getMonth() + 1
      }/${firstDate.getDate()} 00:00:00`,
      `${lastDate.getFullYear()}/${
        lastDate.getMonth() + 1
      }/${lastDate.getDate()} 23:59:59`,
    ];
  } else if (period.type === AccountingPeriodType.Annuel) {
    const firstDate = getFirstDateOfMonth(1, period.selectedYear);
    const lastDate = getLastDayOfMonth(12, period.selectedYear);
    return [
      `${firstDate.getFullYear()}/${
        firstDate.getMonth() + 1
      }/${firstDate.getDate()} 00:00:00`,
      `${lastDate.getFullYear()}/${
        lastDate.getMonth() + 1
      }/${lastDate.getDate()} 23:59:59`,
    ];
  }
};

export const compareDates = (first: Date, second: Date) => {
  return first.getTime() - second.getTime();
};

export const dateStringToFormattedDateString = (date: string): string => {
  if (date) {
    return new Date(date).toLocaleDateString(DEFAULT_DATE_LOCALE);
  }
  return null;
};
