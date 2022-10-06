import { User } from './user';

export interface Departement {
  id: number;
  parent: number;
  intitule: string;
  label: string;
  reception: number;
  comptesAutorises: any[];
  utilisateurs: User[];
}
