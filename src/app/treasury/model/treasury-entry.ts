import { AccountEntryType } from 'src/app/finance/model';

export interface TreasuryEntry {
  accountId: number;
  montant: number;
  montantSysteme: number;
  date: Date;
  libele: string;
  type: AccountEntryType;
  approuve: boolean;
  originalId: number;
  devise: string;
}
