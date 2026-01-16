import { NgClass } from '@angular/common';
import { computed, effect, inject, input, output } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument } from '../../../../shared/models/interfaces';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Workorder } from '../../../services/workorder';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  private _workOrderService = inject(Workorder);
  workCenterId = input<string>('');
  timescale = input<Timescale>();
  columnWidth = 201;
  visibleStartDate: Date = new Date();
  visibleEndDate: Date = new Date();
  positionedOrders: (WorkOrderDocument & { left: number; width: number })[] = [];
  visibleDates = this._workOrderService.visibleDates;
  emptyCellClick = output<Date>();
  orderClick = output<WorkOrderDocument>();
  onDelete = output<WorkOrderDocument>();
  filteredOrders = computed(() =>
    this._workOrderService.filteredOrdersFor().filter(o => o.data.workCenterId === this.workCenterId())
  );
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
    const columns = this.visibleDates();
    const orders = this.filteredOrders();
    if (!columns.length || !orders.length) return;

    const columnMs = this.getColumnDurationMs();
    const columnWidth = this.columnWidth;
    const timelineStart = this.startOfDay(columns[0]);
    const timelineEnd = this.startOfDay(columns[columns.length - 1]) + columnMs;

    this.positionedOrders = orders.map(order => {
      const orderStart = this.startOfDay(order.data.startDate);
      const orderEnd = this.startOfDay(order.data.endDate);

      const clampedStart = Math.max(orderStart, timelineStart);
      const clampedEnd = Math.min(orderEnd, timelineEnd);
      const left = ((clampedStart - timelineStart) / columnMs) * columnWidth;
      const calculated_width = Math.max(1, ((clampedEnd - clampedStart) / columnMs) * columnWidth) - 17;
      const width = this.timescale() === 'day' && calculated_width < this.columnWidth ? this.columnWidth - 17 : calculated_width;
      return { ...order, left, width };
    });
  }

  getColumnDurationMs = () => {
    switch (this.timescale()) {
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  };

  startOfDay = (value: string | number | Date) => {
    const d = typeof value === 'object' ? value : new Date(value);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
}
