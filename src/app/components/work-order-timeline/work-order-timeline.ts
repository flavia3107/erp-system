import { Component, input, OnInit } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineHeader } from './timeline-header/timeline-header';
import { TimelineRow } from './timeline-row/timeline-row';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineHeader, TimelineRow],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements OnInit {
  workCenters = input<WorkCenterDocument[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  timescale: Timescale = 'day';
  visibleDates: Date[] = [];

  ngOnInit() {
    this.generateVisibleDates();
  }

  generateVisibleDates() {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (this.timescale) {
      case 'day':
        start.setDate(today.getDate() - 14);
        end.setDate(today.getDate() + 14);
        break;
      case 'week':
        start.setDate(today.getDate() - 14 * 7);
        end.setDate(today.getDate() + 14 * 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 6);
        end.setMonth(today.getMonth() + 6);
        break;
    }

    const dates: Date[] = [];
    const current = start;

    while (current <= end) {
      dates.push(new Date(current.getTime()));

      switch (this.timescale) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }

    this.visibleDates = dates;
  }

  onTimescaleChange(ts: Timescale) {
    this.timescale = ts;
    this.generateVisibleDates();
  }
}
