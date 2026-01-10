import { Component, input } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';

@Component({
  selector: 'app-timeline-row',
  imports: [TimelineCell],
  templateUrl: './timeline-row.html',
  styleUrl: './timeline-row.scss',
})
export class TimelineRow {
  workCenter = input<WorkCenterDocument>();
  workOrders = input<WorkOrderDocument[]>([]);
  timescale = input<Timescale>();

  get ordersForCenter(): WorkOrderDocument[] {
    return this.workOrders().filter(
      o => o.data.workCenterId === this.workCenter()?.docId
    );
  }
}
