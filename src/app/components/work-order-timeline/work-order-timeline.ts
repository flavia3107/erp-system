import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, input, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { WorkOrderPanel } from '../work-order-panel/work-order-panel';
import { WORK_ORDERS } from '../../../shared/models/dummy_data';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineCell, DatePipe, NgSelectModule, FormsModule, WorkOrderPanel],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements OnInit, AfterViewInit {
  workCenters = input<WorkCenterDocument[]>([]);
  timescale: Timescale = 'day';
  visibleDates = signal<Date[]>([]);
  timescaleOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  panelOpen = false;
  panelMode: 'create' | 'edit' = 'create';
  panelWorkCenterId!: string;
  editingOrder?: WorkOrderDocument | undefined;

  workOrders: WritableSignal<WorkOrderDocument[]> = signal(WORK_ORDERS);
  filteredOrdersFor = computed(() => {
    const orders = this.workOrders();
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

  @ViewChild('headerScroll') headerScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('rightPanel') rightPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('leftPanel') leftPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('timelineBody') timelineBody!: ElementRef<HTMLDivElement>;
  @ViewChild('headerRight') headerRight!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.generateVisibleDates();
  }

  ngAfterViewInit() {
    this.headerRight.nativeElement.scrollLeft = this.timelineBody.nativeElement.scrollLeft;
  }

  generateVisibleDates() {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (this.timescale) {
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

      switch (this.timescale) {
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

    this.visibleDates.set(dates);
  }

  onTimescaleChange() {
    this.generateVisibleDates();
  }


  onRightScroll() {
    const rightEl = this.rightPanel.nativeElement;
    const headerEl = this.headerScroll.nativeElement;
    const leftEl = this.leftPanel.nativeElement;

    headerEl.scrollLeft = rightEl.scrollLeft;
    leftEl.scrollTop = rightEl.scrollTop; // vertical sync
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
    if (this.panelMode === 'create') {
      this.workOrders.set([...this.workOrders(), order]);
    } else {
      this.workOrders.set(
        this.workOrders().map(o => o.docId === order.docId ? order : o)
      );
    }
    this.closePanel();
  }

  deleteOrder(order: WorkOrderDocument) {
    this.workOrders.set(
      this.workOrders().filter(o => o.docId != order.docId) // type-safe
    );
  }
}
