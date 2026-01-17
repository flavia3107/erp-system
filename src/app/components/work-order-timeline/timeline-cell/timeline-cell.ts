import { NgClass } from '@angular/common';
import { computed, effect, inject, input, output } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument } from '../../../../shared/models/interfaces';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Workorder } from '../../../services/workorder';
import { CalculationsHelper } from '../../../services/calculations-helper';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  private _calculationService = inject(CalculationsHelper);
  private _workOrderService = inject(Workorder);
  workCenterId = input<string>('');
  timescale = input<Timescale>();
  columnWidth = 201;
  visibleStartDate: Date = new Date();
  visibleEndDate: Date = new Date();
  visibleDates = this._workOrderService.visibleDates;
  emptyCellClick = output<Date>();
  orderClick = output<WorkOrderDocument>();
  filteredOrders = computed(() =>
    this._workOrderService.filteredOrdersFor().filter(o => o.data.workCenterId === this.workCenterId())
  );
  positionedOrders = computed(() => this._calculationService.orderPositionCalculation(this.filteredOrders(), this.timescale() ?? 'day', this.visibleDates()));

  constructor() {
    effect(() => this.calculateVisibleRange());
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

  deleteOrder(order: WorkOrderDocument) {
    this._workOrderService.deleteOrder(order);
  }
}
