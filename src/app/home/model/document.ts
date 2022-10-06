import { Ecriture } from 'src/app/finance/model';
import { EcritureTresorerie } from 'src/app/treasury';
import { Departement, User } from 'src/app/user';
import { DocumentType } from './document-type';
import { Patient } from './patient';

export interface Document {
  id?: number;
  type?: DocumentType;
  departement?: number;
  patient?: number;
  operateur?: string;
  recommandeur?: string;
  gratuit?: boolean;
  date?: Date;
  lignes?: Ecriture[];
  lignesTresorerie?: EcritureTresorerie[];
  client?: Patient;
  emisPar?: User;
  recommandePar?: User;
  departementOrigine?: Departement;
}
