import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { Timescale } from '../../../../shared/models/interfaces';

@Component({
  selector: 'app-timeline-header',
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss',
})
export class TimelineHeader {
  timescale = input<Timescale>('day');
  timescaleChange = output<Timescale>();
  timescales: Timescale[] = ['day', 'week', 'month'];
  visibleDates = input<Date[]>([]);

  onChange(value: string) {
    this.timescaleChange.emit(value as Timescale);
  }
}
