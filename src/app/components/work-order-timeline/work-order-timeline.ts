import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { Timescale, WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineCell, DatePipe],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements OnInit, AfterViewInit {
  workCenters = input<WorkCenterDocument[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  timescale: Timescale = 'day';
  visibleDates: Date[] = [];
  headerColumnWidth = 80;
  filteredOrdersFor = (wcId: string) =>
    computed(() => this.workOrders().filter(o => o.data.workCenterId === wcId));
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
        start.setDate(today.getDate() - 14 * 7);
        end.setDate(today.getDate() + 14 * 7);
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

    this.visibleDates = dates;
  }

  onTimescaleChange(ts: Timescale) {
    this.timescale = ts;
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
    const scrollLeft = this.timelineBody.nativeElement.scrollLeft;
    this.headerRight.nativeElement.scrollLeft = scrollLeft;
  }
}
