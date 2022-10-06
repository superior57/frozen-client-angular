export enum AccountEntryType {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
}

export class AccountEntry {
  constructor(
    public id?: number,
    public designation?: string,
    public quantite?: number,
    public prixUnitaire?: number,
    public date?: Date,
    public type?: AccountEntryType,
    public devise?: string,
    public accountId?: number,
    public productId?: number,
    public exchangeRateId?: number,
    public approuve?: boolean,
    public prixTotal?: number
  ) {
    this.prixTotal = prixUnitaire * quantite;
  }
}
