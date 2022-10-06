import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountEntryModel, EcritureModel } from '../model';

@Component({
  selector: 'app-account-log',
  templateUrl: './account-log.component.html',
  styleUrls: ['./account-log.component.scss'],
})
export class AccountLogComponent {
  totalAmount$: Observable<number>;

  constructor(
    private ecritureModel: EcritureModel,
    private accountEntries: AccountEntryModel
  ) {
    this.fetchTotalAmount();
  }

  private fetchTotalAmount(): void {
    this.totalAmount$ = AccountEntryModel.calculateTotalAmount(
      this.accountEntries.entries$
    );
  }
}
