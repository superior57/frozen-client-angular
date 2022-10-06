import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DepartmentModel, MenuModel } from 'src/app/common/model';
import { Departement } from 'src/app/user';
import { StatsModel } from '../model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  timeline$: Observable<any[]>;
  income$: Observable<any[]>;
  invsout$: Observable<any[]>;
  departements$: Observable<Departement[]>;
  labovsloss$: Observable<any[]>;

  view: any[] = [420, 250];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  timeline: boolean = true;
  xAxisLabel: string = 'Jour';
  yAxisLabel: string = 'Montant';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7AA3E5', '#A8385D', '#AAE3F5'],
  };

  constructor(
    statsModel: StatsModel,
    private departementModel: DepartmentModel,
    private menuModel: MenuModel,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.timeline$ = statsModel.timeline$;
    this.income$ = statsModel.income$;
    this.invsout$ = statsModel.invsout$;
    this.departements$ = departementModel.list$.pipe(filter((d) => !!d));
    this.labovsloss$ = statsModel.labovsloss$;
  }

  openDepartment(department: Departement): void {
    this.departementModel.selected$.next(department);
    const url = this.route.url.subscribe((url) => {
      const currentUrl = url.join('/');
      const targetUrl = 'reception';

      this.menuModel.pushNavigationUrl('/' + currentUrl);
      this.router.navigateByUrl(targetUrl);
    });
  }
}
