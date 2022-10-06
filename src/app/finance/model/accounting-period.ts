import { AccountingPeriodType } from './accounting-period-type';

export interface AccountingPeriod {
  selectedYear: number;
  selectedMonth: number;
  selectedDate: Date;
  type: AccountingPeriodType;
}
