import { Document } from 'src/app/home/model';
import { EcritureRepartition } from 'src/app/treasury';
import { DetailsEcriture } from './details-ecriture';
import { TauxDeChange } from './taux-de-change';

export interface Ecriture {
  id?: number;
  libele?: string;
  montant?: number;
  montantCdf?: number;
  date?: Date;
  devise?: string;
  compte?: number;
  departement?: number;
  details?: number;
  description?: string;
  ecart?: number;
  taux?: number;
  tauxDeChange?: TauxDeChange;
  detail?: DetailsEcriture;
  piece?: Document;
  ecrituresRepartitions?: EcritureRepartition[];
}
