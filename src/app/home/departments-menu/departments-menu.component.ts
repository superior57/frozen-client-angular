import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DepartmentModel } from 'src/app/common/model';
import { Departement } from 'src/app/user';

@Component({
  selector: 'app-departments-menu',
  templateUrl: './departments-menu.component.html',
  styleUrls: ['./departments-menu.component.scss'],
})
export class DepartmentsMenuComponent {
  departments$: Observable<Departement[]>;

  constructor(departmentModel: DepartmentModel) {
    this.departments$ = departmentModel.list$.pipe(filter((d) => !!d));
  }
}
