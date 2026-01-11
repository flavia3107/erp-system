import { NgClass } from '@angular/common';
import { effect, input } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument, WorkOrderStatus } from '../../../../shared/models/interfaces';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  workOrders = input<WorkOrderDocument[]>([]);
  timescale = input<Timescale>();
  columnWidth = 201;
  visibleStartDate: Date = new Date();
  visibleEndDate: Date = new Date();
  positionedOrders: (WorkOrderDocument & { left: number; width: number })[] = [];
  visibleDates = input<Date[]>([]);

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
    if (!this.visibleDates().length) return;
    const dayMs = 24 * 60 * 60 * 1000;
    const timelineStart = this.visibleDates()[0].getTime();

    this.positionedOrders = this.workOrders().map(order => {
      const orderStart = new Date(order.data.startDate).getTime();
      const orderEnd = new Date(order.data.endDate).getTime();

      // left = days from first visible date * column width
      const left = Math.max(0, Math.floor((orderStart - timelineStart) / dayMs)) * this.columnWidth;

      // width = number of days the order spans * column width
      const width = Math.max(1, Math.ceil((orderEnd - orderStart) / dayMs)) * this.columnWidth;
      return { ...order, left, width };
    });
  }



  statusClass(status: WorkOrderStatus): string {
    return `status-${status}`;
  }
}
