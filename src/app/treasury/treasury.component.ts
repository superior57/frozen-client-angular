import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModel } from '../common/model';
import { UserModel } from '../user';

@Component({
  selector: 'app-treasury',
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss'],
})
export class TreasuryComponent {
  hideDashBoard: boolean = false;

  constructor(
    public userModel: UserModel,
    private menuModel: MenuModel,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onNewBillClick(): void {
    this.route.url.subscribe((url) => {
      const currentUrl = '/' + url.join('/');
      const destinationurl = '/facture/bon?freeQuote=false';

      this.router.navigateByUrl(destinationurl);
      this.menuModel.pushNavigationUrl(currentUrl);
    });
  }

  onViewBillsClick(): void {
    this.hideDashBoard = true;
  }
}
