import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { User, UserModel } from 'src/app/user/model';
import {
  DepartmentModel,
  MenuModel,
  Reception,
  ReceptionModel,
} from '../model';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  receptions$: Observable<Reception[]>;
  user$: Observable<User>;
  shouldDisplayLogo$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    departmentModel: DepartmentModel,
    public receptionModel: ReceptionModel,
    public menuModel: MenuModel,
    public userModel: UserModel,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) =>
        this.shouldDisplayLogo$.next(!this.router.url.includes('acceuil'))
      );

    this.receptions$ = departmentModel.list$
      .pipe(
        filter((d) => !!d),
        switchMap((departements) =>
          receptionModel.filter({ id: departements.map((d) => d.reception) })
        )
      )
      .pipe(
        filter((r) => !!r && r.length > 0),
        tap((receptions) => this.setSelectedReception(receptions[0]))
      );

    this.user$ = userModel.activeUser.pipe(filter((u) => !!u));
  }

  setSelectedReception(reception: Reception): void {
    if (reception) {
      this.receptionModel.activeReception$.next(reception);
    }
  }

  logoutUser(): void {
    this.userModel.logout();
  }

  ngOnInit(): void {
    this.shouldDisplayLogo$.next(!this.router.url.includes('acceuil'));
  }
}
