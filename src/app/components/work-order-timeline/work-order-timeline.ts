import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { WorkOrderPanel } from '../work-order-panel/work-order-panel';
import { Workorder } from '../../services/workorder';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineCell, DatePipe, NgSelectModule, FormsModule, WorkOrderPanel],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements AfterViewInit {
  private _workOrderService = inject(Workorder);
  public workCenters = input<WorkCenterDocument[]>([]);
  public timescale: Timescale = 'day';
  timescaleOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  public visibleDates = this._workOrderService.visibleDates;
  public panelOpen = false;
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

  public onTimescaleChange() {
    this._workOrderService.updateVisibleDatesRange(this.timescale);
  }

  public onRightScroll() {
    const rightEl = this.rightPanel.nativeElement;
    const headerEl = this.headerScroll.nativeElement;
    const leftEl = this.leftPanel.nativeElement;
    headerEl.scrollLeft = rightEl.scrollLeft;
    leftEl.scrollTop = rightEl.scrollTop;
  }

  public onBodyScroll() {
    const scrollLeft = this.timelineBody?.nativeElement.scrollLeft;
    if (this.headerRight)
      this.headerRight.nativeElement.scrollLeft = scrollLeft;
  }

  public openCreate(workCenterId: any) {
    this.panelMode = 'create';
    this.panelWorkCenterId = workCenterId;
    this.panelOpen = true;
  }

  public openEdit(order: WorkOrderDocument) {
    this.panelMode = 'edit';
    this.editingOrder = order;
    this.panelWorkCenterId = order.data.workCenterId;
    this.panelOpen = true;
  }

  public closePanel() {
    this.panelOpen = false;
  }

  public onSave(order: WorkOrderDocument) {
    this._workOrderService.updateOrCreateWorkOrders(order, this.panelMode);
    this.closePanel();
  }
}
