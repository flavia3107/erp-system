import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WORK_CENTERS, WORK_ORDERS } from '../shared/models/dummy_data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('erm-system');
  constructor() {
    console.log('HERE', WORK_CENTERS, WORK_ORDERS)
  }
}
