import { Departement } from 'src/app/user';
import { Compte } from './compte';

export interface EcritureRepartition {
  id: number;
  montant: number;
  departement: number;
  compte: number;
  compteDestination: Compte;
  departementOrigine: Departement;
}
