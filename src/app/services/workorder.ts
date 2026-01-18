import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { WORK_ORDERS } from '../shared/models/dummy_data';
import { Timescale, WorkOrderDocument } from '../shared/models/interfaces';
import { CalculationsHelper } from './calculations-helper';

@Injectable({
  providedIn: 'root',
})
export class Workorder {
  private _calculationService = inject(CalculationsHelper);
  private _workOrders: WritableSignal<WorkOrderDocument[]> = signal(WORK_ORDERS);
  public visibleDates = signal<Date[]>(this._calculationService.generateVisibleDates('day'));
  public filteredOrdersFor = computed(() => this._filterOrdersHelper());

  public updateOrCreateWorkOrders(workOrder: WorkOrderDocument, panelMode: string) {
    if (panelMode === 'create') {
      this._workOrders.set([...this._workOrders(), workOrder]);
    } else {
      this._workOrders.set(
        this._workOrders().map(o => o.docId === workOrder.docId ? workOrder : o)
      );
    }
  }

  public deleteOrder(order: WorkOrderDocument) {
    this._workOrders.update(orders =>
      orders.filter(o => o.docId !== order.docId)
    );
  }

  private _filterOrdersHelper() {
    const orders = this._workOrders();
    const dates = this.visibleDates();

    if (!dates.length) return [];

    const visibleStart = new Date(dates[0].toDateString());
    const visibleEnd = new Date(dates[dates.length - 1].toDateString());

    return orders.filter(o => {
      const start = new Date(o.data.startDate);
      const end = new Date(o.data.endDate);
      return start <= visibleEnd && end >= visibleStart;
    });
  }

  public updateVisibleDatesRange(timescale: Timescale) {
    this.visibleDates.set(this._calculationService.generateVisibleDates(timescale));
  }

  public updateWorkorder(orderDetails: Partial<WorkOrderDocument>) {
    const order: WorkOrderDocument = {
      docId: orderDetails.docId ?? this._calculationService.generateUUID(),
      docType: 'workOrder',
      data: {
        name: orderDetails.data?.name!,
        status: orderDetails.data?.status!,
        workCenterId: orderDetails.data?.workCenterId!,
        startDate: orderDetails.data?.startDate!,
        endDate: orderDetails.data?.endDate!
      }
    };
    return order;
  }
}
