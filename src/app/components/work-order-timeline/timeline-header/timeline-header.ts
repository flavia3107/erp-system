import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Timescale } from '../../../../shared/models/interfaces';

@Component({
  selector: 'app-timeline-header',
  imports: [TitleCasePipe],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss',
})
export class TimelineHeader {
  timescale = input<Timescale>('day');
  timescaleChange = output<Timescale>();

  timescales: Timescale[] = ['day', 'week', 'month'];

  onChange(value: string) {
    this.timescaleChange.emit(value as Timescale);
  }
}
