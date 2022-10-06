import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input()
  value: any;

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  onKeypress(value: string): void {
    this.valueChange.emit(value);
  }
}
