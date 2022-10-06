import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  DepartmentModel,
  MenuModel,
  ReceptionModel,
} from 'src/app/common/model';
import { Departement, UserModel } from 'src/app/user';

@Component({
  selector: 'app-reception-menu',
  templateUrl: './reception-menu.component.html',
  styleUrls: ['./reception-menu.component.scss'],
})
export class ReceptionMenuComponent {
  readonly departmentsUiDetails: any = {
    ophtalmologie: {
      image: 'icons8-surprise-64.png',
      background: '#009688',
      color: '#fff',
    },
    hemodialyse: {
      image: 'icons8-blood-donation-64.png',
      background: '#ff9800',
    },
    dentisterie: {
      background: '#ff9800',
      image: 'icons8-toothache-64.png',
      color: '#000',
    },
    officine: {
      image: 'icons8-pills-64.png',
      background: '#e91e63',
    },
    lunetterie: {
      image: 'icons8-vintage-glasses-64.png',
      background: '#3f51b5',
    },
    laboratoire: {
      image: 'icons8-blood-sample-64.png',
      background: '#e91e63',
      color: '#fff',
    },
    sang: {
      image: 'icons8-blood-donation-64.png',
      background: '#ff4722',
      color: '#000',
    },
    hospitalisation: {
      image: 'icons8-occupied-bed-64.png',
      background: '#03a9f4',
      color: '#fff',
    },
  };
  departments$: Observable<Departement[]>;

  constructor(
    public userModel: UserModel,
    private departmentModel: DepartmentModel,
    private router: Router,
    private menuModel: MenuModel,
    private route: ActivatedRoute
  ) {
    this.departments$ = departmentModel.list$.pipe(filter((d) => !!d));
  }

  openDepartment(department: Departement): void {
    this.departmentModel.selected$.next(department);
    const url = this.route.url.subscribe((url) => {
      const currentUrl = url.join('/');
      const targetUrl = '/reception';

      this.menuModel.pushNavigationUrl('/' + currentUrl);
      this.router.navigateByUrl(targetUrl);
    });
  }

  getMenuIcon(department: string): string {
    return this.departmentsUiDetails[department.toLowerCase()].image;
  }

  getMenuClass(department: string): string {
    return `background-color: ${
      this.departmentsUiDetails[department].background
    }; color: ${this.departmentsUiDetails[department].color || '#fff'}`;
  }

  ngOnDestroy(): void {
    this.menuModel.shouldDisplayReceptionMenu$.next(false);
  }
}
