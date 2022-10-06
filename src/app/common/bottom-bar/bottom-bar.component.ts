import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserModel } from 'src/app/user/model';
import { MenuModel } from '../model';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss'],
})
export class BottomBarComponent {
  @HostBinding('class') readonly ngClass = 'mat-elevation-z16';

  private user$: Observable<User>;

  constructor(public menuModel: MenuModel, public user: UserModel) {}
}
