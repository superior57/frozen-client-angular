import { Shadow } from 'src/app/login';
import { Role } from './role';
import { UserDepartmentAssociation } from './user-department-association';

export class User {
  constructor(
    public nom?: string,
    public prenom?: string,
    public postnom?: string,
    public identifiant?: string,
    public roles?: Role[],
    public departements?: UserDepartmentAssociation[],
    public shadow?: Shadow
  ) {}
}
