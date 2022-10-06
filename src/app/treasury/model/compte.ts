import { Ecriture } from 'src/app/finance/model';
import { EcritureRepartition } from './ecriture-repartition';
import { EcritureTresorerie } from './ecriture-tresorerie';

export interface Compte {
  id: number;
  intitule: string;
  balance: number;
  code: string;
  ecrituresTresorerie: EcritureTresorerie[];
  ecritures: Ecriture[];
  etats: any[];
}
