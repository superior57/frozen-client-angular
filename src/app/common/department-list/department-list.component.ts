import { Component } from '@angular/core';
import { DepartmentModel } from '../model';
import { Observable } from 'rxjs';
import { Departement } from 'src/app/user/model';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent {
  departments$: Observable<Departement[]>;

  constructor(public departmentModel: DepartmentModel) {
    this.departments$ = departmentModel.list$;
  }

  setSelectedDepartment(department: Departement): void {
    this.departmentModel.selected$.next(department);
  }
}
