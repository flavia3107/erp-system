import { NgClass } from '@angular/common';
import { input } from '@angular/core';
import { Component } from '@angular/core';
import { PositionedOrder, Timescale, WorkOrderDocument, WorkOrderStatus } from '../../../../shared/models/interfaces';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  workOrders = input<WorkOrderDocument[]>([]);
  timescale = input<Timescale>();

  // temporary static layout values
  columnWidth = 80;

  get positionedOrders(): PositionedOrder[] {
    return this.workOrders().map((o, index) => ({
      ...o,
      left: index * 120,
      width: 100
    }));
  }

  statusClass(status: WorkOrderStatus): string {
    return `status-${status}`;
  }
}
