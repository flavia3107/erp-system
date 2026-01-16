import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { WORK_ORDERS } from '../../shared/models/dummy_data';
import { Timescale, WorkOrderDocument } from '../../shared/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Workorder {
  private _workOrders: WritableSignal<WorkOrderDocument[]> = signal(WORK_ORDERS);
  public visibleDates = signal<Date[]>(this.generateVisibleDates('day'));
  public filteredOrdersFor = computed(() => {
    const orders = this._workOrders();
    const dates = this.visibleDates();
    if (!dates.length) return [];

    const visibleStart = dates[0];
    const visibleEnd = dates[dates.length - 1];

    return orders.filter(o => {
      const start = new Date(o.data.startDate);
      const end = new Date(o.data.endDate);
      return end >= visibleStart && start <= visibleEnd;
    });
  });

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

  public updateOrCreateWorkOrders(workOrder: WorkOrderDocument, panelMode?: string) {
    if (panelMode === 'create') {
      this._workOrders.set([...this._workOrders(), workOrder]);
    } else {
      this._workOrders.set(
        this._workOrders().map(o => o.docId === workOrder.docId ? workOrder : o)
      );
    }
  }
}


