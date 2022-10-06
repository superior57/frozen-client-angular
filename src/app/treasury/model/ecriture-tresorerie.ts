import { DetailsEcriture, TauxDeChange } from 'src/app/finance/model';

export interface EcritureTresorerie {
  id?: number;
  libele?: string;
  montant?: number;
  montantSysteme?: number;
  date?: Date;
  devise?: string;
  departement?: number;
  tauxDeChange?: TauxDeChange;
  detail?: DetailsEcriture;
}
