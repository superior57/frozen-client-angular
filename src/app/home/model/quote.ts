import { AccountEntry } from 'src/app/finance/model';
import { Patient } from './patient';

export interface Quote {
  id?: number;
  patientId?: number;
  date?: Date;
  operateur?: string;
  logEntries?: AccountEntry[];
  patient?: Patient;
}
