import { PriseSignesVitaux } from './prise-signes-vitaux';

export interface Consultation {
  id?: string,
  description?: string;
  date?: string;
  patient?: string;
  medecin?: string;
  departement?: number;
  notes?: string;
  Patient?: any;
  SignesVitaux: PriseSignesVitaux;
}
