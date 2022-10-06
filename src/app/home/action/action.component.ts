import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  @Input()
  text: string;

  @Input()
  img: string;

  @Input()
  icon = 'add';

  @HostBinding('class')
  ngClass = '';

  ngOnInit(): void {
    if (this.icon === 'add') {
      this.ngClass = 'mat-elevation-z4';
    }
  }
}
