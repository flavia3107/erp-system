import { Component, signal } from '@angular/core';
import { WORK_CENTERS, WORK_ORDERS } from '../shared/models/dummy_data';
import { WorkCenterList } from './components/work-center-list/work-center-list';
import { WorkOrderTimeline } from './components/work-order-timeline/work-order-timeline';

@Component({
  selector: 'app-root',
  imports: [WorkOrderTimeline, WorkCenterList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('erm-system');
  workCenters = WORK_CENTERS;
  workOrders = WORK_ORDERS;
  constructor() {
    console.log('HERE', WORK_CENTERS, WORK_ORDERS)
  }
}
