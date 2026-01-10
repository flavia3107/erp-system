import { NgClass } from '@angular/common';
import { effect, input } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument, WorkOrderStatus } from '../../../../../shared/models/interfaces';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  workOrders = input<WorkOrderDocument[]>([]);
  timescale = input<Timescale>();
  columnWidth = 80;
  visibleStartDate: Date = new Date();
  visibleEndDate: Date = new Date();
  totalWidth = 2000;
  positionedOrders: (WorkOrderDocument & { left: number; width: number })[] = [];

  constructor() {
    effect(() => {
      this.calculateVisibleRange();
      this.positionOrders();
    });
  }

  calculateVisibleRange() {
    const today = new Date();
    switch (this.timescale()) {
      case 'day':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setDate(today.getDate() - 14); // -2 weeks
        this.visibleEndDate = new Date();
        this.visibleEndDate.setDate(today.getDate() + 14); // +2 weeks
        break;
      case 'week':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setDate(today.getDate() - 14 * 7); // -14 weeks
        this.visibleEndDate = new Date();
        this.visibleEndDate.setDate(today.getDate() + 14 * 7); // +14 weeks
        break;
      case 'month':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setMonth(today.getMonth() - 6); // -6 months
        this.visibleEndDate = new Date();
        this.visibleEndDate.setMonth(today.getMonth() + 6); // +6 months
        break;
    }
  }

  positionOrders() {
    const startMs = this.visibleStartDate.getTime();
    const endMs = this.visibleEndDate.getTime();
    const totalMs = endMs - startMs;

    this.positionedOrders = this.workOrders().map(order => {
      const orderStart = new Date(order.data.startDate).getTime();
      const orderEnd = new Date(order.data.endDate).getTime();

      const left = ((orderStart - startMs) / totalMs) * this.totalWidth;
      const width = ((orderEnd - orderStart) / totalMs) * this.totalWidth;

      return { ...order, left, width };
    });
  }

  statusClass(status: WorkOrderStatus): string {
    return `status-${status}`;
  }
}
