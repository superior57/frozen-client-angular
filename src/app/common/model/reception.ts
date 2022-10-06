import { Departement } from 'src/app/user';

export interface Reception {
  id: number;
  intitule: string;
  description: string;
  departements: Departement[];
}
