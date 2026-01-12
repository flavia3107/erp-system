import { NgClass } from '@angular/common';
import { effect, input, output } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument, WorkOrderStatus } from '../../../../shared/models/interfaces';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass, MatMenuModule, MatIconModule, MatButtonModule],
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
  emptyCellClick = output<Date>();
  orderClick = output<WorkOrderDocument>();
  onDelete = output<WorkOrderDocument>();

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
        this.visibleStartDate.setDate(today.getDate() - 4 * 7); // -4 weeks
        this.visibleEndDate = new Date();
        this.visibleEndDate.setDate(today.getDate() + 4 * 7); // +4 weeks
        break;
      case 'month':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setMonth(today.getMonth() - 3); // -3 months
        this.visibleEndDate = new Date();
        this.visibleEndDate.setMonth(today.getMonth() + 3); // +3 months
        break;
    }
  }

  positionOrders() {
    if (!this.visibleDates().length || !this.workOrders().length) return;

    const columns = this.visibleDates();
    const columnCount = columns.length;
    const columnMs = this.getColumnDurationMs();
    const timelineStart = this.startOfDay(columns[0]);
    const timelineEnd = this.startOfDay(columns[columns.length - 1]) + columnMs;

    this.positionedOrders = this.workOrders().map(order => {
      const orderStart = this.startOfDay(new Date(order.data.startDate));
      const orderEnd = this.startOfDay(new Date(order.data.endDate));
      const clampedStart = Math.max(orderStart, timelineStart);
      const clampedEnd = Math.min(orderEnd, timelineEnd);

      // find start column index
      let startIndex = 0;
      for (let i = 0; i < columnCount; i++) {
        const colStart = this.startOfDay(columns[i]);
        const colEnd = i + 1 < columnCount ? this.startOfDay(columns[i + 1]) : colStart + columnMs;
        if (clampedStart >= colStart && clampedStart < colEnd) {
          startIndex = i;
          break;
        }
      }

      // find end column index
      let endIndex = startIndex;
      for (let i = startIndex; i < columnCount; i++) {
        const colStart = this.startOfDay(columns[i]);
        const colEnd = i + 1 < columnCount ? this.startOfDay(columns[i + 1]) : colStart + columnMs;
        if (clampedEnd >= colStart && clampedEnd <= colEnd) {
          endIndex = i;
          break;
        }
      }

      // fractional position inside first and last columns
      const firstColStart = this.startOfDay(columns[startIndex]);
      const firstColEnd = startIndex + 1 < columnCount ? this.startOfDay(columns[startIndex + 1]) : firstColStart + columnMs;
      const lastColStart = this.startOfDay(columns[endIndex]);
      const lastColEnd = endIndex + 1 < columnCount ? this.startOfDay(columns[endIndex + 1]) : lastColStart + columnMs;
      const fractionStart = (clampedStart - firstColStart) / (firstColEnd - firstColStart);
      const fractionEnd = (clampedEnd - lastColStart) / (lastColEnd - lastColStart);
      const left = startIndex * this.columnWidth + fractionStart * this.columnWidth;
      const width = Math.max(1, (endIndex - startIndex - 1) * this.columnWidth + (1 - fractionStart) * this.columnWidth + fractionEnd * this.columnWidth) - 17;

      return { ...order, left, width };
    });
  }


  findColumnIndex(date: Date, columns: Date[]): number {
    for (let i = 0; i < columns.length; i++) {
      const start = columns[i].getTime();
      let end: number;
      if (i < columns.length - 1) {
        end = columns[i + 1].getTime() - 1;
      } else {
        end = start + 24 * 60 * 60 * 1000; // last column: add 1 day
      }
      if (date.getTime() >= start && date.getTime() <= end) return i;
    }
    return 0;
  }

  getColumnDurationMs = () => {
    switch (this.timescale()) {
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000; // approx month
      default: return 24 * 60 * 60 * 1000;
    }
  };

  startOfDay = (date: Date) => {
    const d = date;
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };


  statusClass(status: WorkOrderStatus): string {
    return `status-${status}`;
  }

}
