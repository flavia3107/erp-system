import { NgClass } from '@angular/common';
import { computed, inject, input, output } from '@angular/core';
import { Component } from '@angular/core';
import { Timescale, WorkOrderDocument } from '../../../../shared/models/interfaces';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Workorder } from '../../../services/workorder';
import { CalculationsHelper } from '../../../services/calculations-helper';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-timeline-cell',
  imports: [NgClass, MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './timeline-cell.html',
  styleUrl: './timeline-cell.scss',
})
export class TimelineCell {
  private _calculationService = inject(CalculationsHelper);
  private _workOrderService = inject(Workorder);
  public workCenterId = input<string>('');
  public timescale = input<Timescale>();
  public filteredOrders = computed(() => this._filteredOrdersHelper());
  public positionedOrders = computed(() => this._positionedOrdersHelper());
  public emptyCellClick = output<Date>();
  public orderClick = output<WorkOrderDocument>();
  public visibleDates = this._workOrderService.visibleDates;

  public deleteOrder(order: WorkOrderDocument) {
    this._workOrderService.deleteOrder(order);
  }

  private _positionedOrdersHelper() {
    return this._calculationService.orderPositionCalculation(this.filteredOrders(), this.timescale() ?? 'day', this.visibleDates());
  }

  private _filteredOrdersHelper() {
    return this._workOrderService.filteredOrdersFor().filter(o => o.data.workCenterId === this.workCenterId());
  }
}
