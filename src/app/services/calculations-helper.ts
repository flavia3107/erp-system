import { Injectable } from '@angular/core';
import { Timescale, WorkOrderDocument } from '../../shared/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculationsHelper {

  public generateVisibleDates(timescale: Timescale) {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (timescale) {
      case 'day':
        start.setDate(today.getDate() - 14);
        end.setDate(today.getDate() + 14);
        break;
      case 'week':
        start.setDate(today.getDate() - 8 * 7);
        end.setDate(today.getDate() + 8 * 7);
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
    const columnWidth = 201;
    if (!columns.length || !orders.length) return [];
    const columnMs = this._getColumnDurationMs(timescale);
    const timelineStart = this._startOfDay(columns[0]);
    const timelineEnd = this._startOfDay(columns[columns.length - 1]) + columnMs;

    return orders.map(order => {
      const orderStart = this._startOfDay(order.data.startDate);
      const orderEnd = this._startOfDay(order.data.endDate);
      const clampedStart = Math.max(orderStart, timelineStart);
      const clampedEnd = Math.min(orderEnd, timelineEnd);
      const left = ((clampedStart - timelineStart) / columnMs) * columnWidth;

      const calculatedWidth = Math.max(1, ((clampedEnd - clampedStart) / columnMs) * columnWidth) - 17;
      const width = timescale === 'day' && calculatedWidth < columnWidth ? columnWidth - 17 : calculatedWidth;
      return { ...order, left, width };
    });
  }

  private _getColumnDurationMs = (timescale: Timescale) => {
    switch (timescale) {
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  };

  private _startOfDay = (value: string | number | Date) => {
    const d = typeof value === 'object' ? value : new Date(value);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
}
