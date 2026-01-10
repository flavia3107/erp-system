import { Component, input } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineHeader } from './timeline-header/timeline-header';
import { TimelineRow } from './timeline-row/timeline-row';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineHeader, TimelineRow],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline {
  workCenters = input<WorkCenterDocument[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  timescale: Timescale = 'day';
}
