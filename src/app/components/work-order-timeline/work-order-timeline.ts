import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { WorkOrderPanel } from '../work-order-panel/work-order-panel';
import { Workorder } from '../../services/workorder';
import { CalculationsHelper } from '../../services/calculations-helper';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineCell, DatePipe, NgSelectModule, FormsModule, WorkOrderPanel],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements AfterViewInit {
  private _calculationService = inject(CalculationsHelper);
  private _workOrderService = inject(Workorder);
  public visibleDates = this._workOrderService.visibleDates;
  workCenters = input<WorkCenterDocument[]>([]);
  timescale: Timescale = 'day';
  timescaleOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  panelOpen = false;
  panelMode: 'create' | 'edit' = 'create';
  panelWorkCenterId!: string;
  editingOrder?: WorkOrderDocument | undefined;

  @ViewChild('headerScroll') headerScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('rightPanel') rightPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('leftPanel') leftPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('timelineBody') timelineBody!: ElementRef<HTMLDivElement>;
  @ViewChild('headerRight') headerRight!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.headerRight.nativeElement.scrollLeft = this.timelineBody.nativeElement.scrollLeft;
  }

  onTimescaleChange() {
    this._calculationService.generateVisibleDates(this.timescale);
  }

  onRightScroll() {
    const rightEl = this.rightPanel.nativeElement;
    const headerEl = this.headerScroll.nativeElement;
    const leftEl = this.leftPanel.nativeElement;

    headerEl.scrollLeft = rightEl.scrollLeft;
    leftEl.scrollTop = rightEl.scrollTop;
  }

  onBodyScroll() {
    const scrollLeft = this.timelineBody?.nativeElement.scrollLeft;
    if (this.headerRight)
      this.headerRight.nativeElement.scrollLeft = scrollLeft;
  }

  openCreate(workCenterId: any) {
    this.panelMode = 'create';
    this.panelWorkCenterId = workCenterId;
    this.panelOpen = true;
  }

  openEdit(order: WorkOrderDocument) {
    this.panelMode = 'edit';
    this.editingOrder = order;
    this.panelWorkCenterId = order.data.workCenterId;
    this.panelOpen = true;
  }

  closePanel() {
    this.panelOpen = false;
  }

  onSave(order: WorkOrderDocument) {
    this._workOrderService.updateOrCreateWorkOrders(order, this.panelMode);
    this.closePanel();
  }
}
