import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Timescale, WorkOrderDocument } from '../../shared/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculationsHelper {
  visibleEndDate: Date = new Date();
  visibleStartDate: Date = new Date();

  public generateVisibleDates(timescale: Timescale) {
    const today = new Date();
    switch (timescale) {
      case 'day':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setDate(today.getDate() - 14);
        this.visibleEndDate = new Date();
        this.visibleEndDate.setDate(today.getDate() + 14);
        break;
      case 'week':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setDate(today.getDate() - 8 * 7);
        this.visibleEndDate = new Date();
        this.visibleEndDate.setDate(today.getDate() + 8 * 7);
        break;
      case 'month':
        this.visibleStartDate = new Date();
        this.visibleStartDate.setMonth(today.getMonth() - 6)
        this.visibleEndDate = new Date();
        this.visibleEndDate.setMonth(today.getMonth() + 6);
        break;
    }

    const dates: Date[] = [];
    const current = this.visibleStartDate;

    while (current <= this.visibleEndDate) {
      dates.push(new Date(current.getTime()));

      switch (timescale) {
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
    return dates;
  }

  public orderPositionCalculation(orders: WorkOrderDocument[], timescale: Timescale, columns: Date[]) {
    if (!columns.length || !orders.length) return [];

    switch (timescale) {
      case 'month':
        return this._calculateMonthViewPositions(orders, columns);

      case 'week':
        return this._calculateWeekViewPositions(orders, columns);

      default:
        return this._calculateDayViewPositions(orders, columns);
    }
  }

  private _calculateDayViewPositions(orders: WorkOrderDocument[], columns: Date[]) {
    const columnWidth = 201;
    const columnMs = 24 * 60 * 60 * 1000;
    const timelineStart = this._startOfDay(columns[0]);
    const timelineEnd = this._startOfDay(columns[columns.length - 1]) + columnMs;

    return orders.map(order => {
      const orderStart = this.parseLocalDate(order.data.startDate).getTime();
      const orderEnd = this.parseLocalDate(order.data.endDate).getTime() + columnMs;
      const clampedStart = Math.max(orderStart, timelineStart);
      const clampedEnd = Math.min(orderEnd, timelineEnd);
      const left = ((clampedStart - timelineStart) / columnMs) * columnWidth;
      const calculatedWidth = Math.max(1, ((clampedEnd - clampedStart) / columnMs) * columnWidth) - 17;
      const width = calculatedWidth < columnWidth ? columnWidth - 17 : calculatedWidth;
      return { ...order, left, width };
    });
  }

  private _calculateMonthViewPositions(orders: WorkOrderDocument[], columns: Date[]) {
    const columnWidth = 201;
    const timelineStart = this._startOfDay(columns[0]);
    const timelineEnd = this._startOfDay(columns[columns.length - 1]);

    return orders.map(order => {
      const orderStart = this.parseLocalDate(order.data.startDate).getTime();
      const orderEnd = this.parseLocalDate(order.data.endDate).getTime();
      const clampedStart = new Date(Math.max(orderStart, timelineStart));
      const clampedEnd = new Date(Math.min(orderEnd, timelineEnd));
      const startColumnIndex = columns.findIndex(c => c.getFullYear() === clampedStart.getFullYear() && c.getMonth() === clampedStart.getMonth());
      const endColumnIndex = columns.findIndex(c => c.getFullYear() === clampedEnd.getFullYear() && c.getMonth() === clampedEnd.getMonth());
      const startDaysInMonth = new Date(clampedStart.getFullYear(), clampedStart.getMonth() + 1, 0).getDate();
      const endDaysInMonth = new Date(clampedEnd.getFullYear(), clampedEnd.getMonth() + 1, 0).getDate();
      const left = startColumnIndex * columnWidth + ((clampedStart.getDate() - 1) / startDaysInMonth) * columnWidth;
      const right = endColumnIndex * columnWidth + (clampedEnd.getDate() / endDaysInMonth) * columnWidth - 17;
      const width = Math.max(1, right - left);
      return { ...order, left, width };
    });
  }

  private _calculateWeekViewPositions(orders: WorkOrderDocument[], columns: Date[]) {
    const columnWidth = 201;
    const columnMs = 7 * 24 * 60 * 60 * 1000;
    const dayWidth = columnWidth / 7;
    const timelineStart = this._startOfDay(columns[0]);
    const timelineEnd = this._startOfDay(columns[columns.length - 1]) + columnMs;

    return orders.map(order => {
      const orderStart = this.parseLocalDate(order.data.startDate).getTime();
      const orderEnd = this.parseLocalDate(order.data.endDate).getTime() + 24 * 60 * 60 * 1000;
      const clampedStart = Math.max(orderStart, timelineStart);
      const clampedEnd = Math.min(orderEnd, timelineEnd);
      const startColumnIndex = Math.floor((clampedStart - timelineStart) / columnMs);
      const endColumnIndex = Math.floor((clampedEnd - timelineStart) / columnMs);
      const startDayOffset = Math.floor(((clampedStart - timelineStart) % columnMs) / (24 * 60 * 60 * 1000));
      const endDayOffset = Math.floor(((clampedEnd - timelineStart) % columnMs) / (24 * 60 * 60 * 1000));
      const left = startColumnIndex * columnWidth + startDayOffset * dayWidth + 5;
      const width = Math.max(1, (endColumnIndex - startColumnIndex) * columnWidth + (endDayOffset - startDayOffset) * dayWidth - 15);

      return { ...order, left, width };
    });
  }

  private _startOfDay = (value: string | number | Date) => {
    if (typeof value === 'string') {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d).getTime();
    }

    const d = new Date(typeof value === 'object' ? value.getTime() : value);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  public parseLocalDate(date: string): Date {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  public toNgb(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  public generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public toISO = (d: NgbDateStruct) => {
    return new Date(d.year, d.month - 1, d.day).toISOString().slice(0, 10);
  };
}
