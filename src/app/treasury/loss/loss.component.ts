import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/user';

@Component({
  selector: 'app-loss',
  templateUrl: './loss.component.html',
  styleUrls: ['./loss.component.scss'],
})
export class LossComponent {
  constructor(public userModel: UserModel) {}
}
