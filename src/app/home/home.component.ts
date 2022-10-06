import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  reason: string;
  price: number;
  currency = 'CDF';
  sheetNumber: string;
  dataSource$: Observable<any[]>;

  constructor() {}

  ngOnInit(): void {}
}
