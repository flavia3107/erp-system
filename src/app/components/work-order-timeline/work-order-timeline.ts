import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument } from '../../../shared/models/interfaces';
import { TimelineCell } from './timeline-cell/timeline-cell';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-order-timeline',
  imports: [TimelineCell, DatePipe, NgSelectModule, FormsModule],
  templateUrl: './work-order-timeline.html',
  styleUrl: './work-order-timeline.scss',
})
export class WorkOrderTimeline implements OnInit, AfterViewInit {
  workCenters = input<WorkCenterDocument[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  timescale = 'day';
  visibleDates: Date[] = [];
  timescaleOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  filteredOrdersFor = (wcId: string) =>
    computed(() => {
      const visibleStart = this.visibleDates[0];
      const visibleEnd = this.visibleDates[this.visibleDates.length - 1];

      return this.workOrders().filter(o => {
        if (o.data.workCenterId !== wcId) return false;
        const orderStart = new Date(o.data.startDate);
        const orderEnd = new Date(o.data.endDate);
        return orderEnd >= visibleStart && orderStart <= visibleEnd;
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
    const scrollLeft = this.timelineBody.nativeElement.scrollLeft;
    this.headerRight.nativeElement.scrollLeft = scrollLeft;
  }
}
