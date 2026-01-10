import { Component, input } from '@angular/core';
import { WorkCenterDocument } from '../../../shared/models/interfaces';

@Component({
  selector: 'app-work-center-list',
  imports: [],
  templateUrl: './work-center-list.html',
  styleUrl: './work-center-list.scss',
})
export class WorkCenterList {
  workCenters = input<WorkCenterDocument[]>([]);
}
