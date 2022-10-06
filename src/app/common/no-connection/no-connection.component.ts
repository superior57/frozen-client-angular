import { Component } from '@angular/core';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.component.html',
  styleUrls: ['./no-connection.component.scss'],
})
export class NoConnectionComponent {
  refresh(): void {
    window.location.assign('/');
  }
}
