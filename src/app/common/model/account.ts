import { AccountDispatchSetting } from 'src/app/treasury';

export class Account {
  constructor(
    public id: number,
    public nom: string,
    public depensesAutorisees: boolean,
    public facturationAutorisee: boolean,
    public dispatchSettings?: AccountDispatchSetting[]
  ) {}
}
