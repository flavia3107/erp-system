import { NgClass } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { WorkOrderDocument, WorkOrderStatus } from '../../../shared/models/interfaces';

@Component({
  selector: 'app-work-order-panel',
  imports: [ReactiveFormsModule, NgSelectComponent, NgbDatepickerModule, NgClass],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel {
  open = input<boolean>(false);
  mode = input<'create' | 'edit'>('create');
  workCenterId = input<string>('');
  workOrders = input<WorkOrderDocument[]>([]);
  editingOrder = input<WorkOrderDocument | undefined>();
  save = output<WorkOrderDocument>();
  cancel = output<void>();
  startDate: Date = new Date();
  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  form: any;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: [null as any, Validators.required],
      endDate: [null as any, Validators.required]
    });
    effect(() => {
      if (this.mode() === 'edit' && this.editingOrder()) {
        // edit: populate with existing values
        this.form.patchValue({
          name: this.editingOrder()?.data.name,
          status: this.editingOrder()?.data.status,
          startDate: this.editingOrder()?.data.startDate,
          endDate: this.editingOrder()?.data.endDate
        });
      }

      if (this.mode() === 'create') {
        // create: reset all values
        const end = this.startDate ? this.startDate : new Date();
        if (this.startDate) end.setDate(end.getDate() + 7);
        this.form.reset({
          status: 'open',
        });

        this.form.setErrors(null);
      }
    });
  }


  submit() {
    if (this.form.invalid) return;

    const { startDate, endDate } = this.form.value;

    const overlap = this.workOrders()
      .filter(o => o.data.workCenterId === this.workCenterId())
      .some(o =>
        new Date(o.data.startDate) <= new Date(endDate!) &&
        new Date(o.data.endDate) >= new Date(startDate!)
      );

    if (overlap) {
      this.form.setErrors({ overlap: true });
      return;
    }

    const start = this.toISO(this.form.value.startDate);
    const end = this.toISO(this.form.value.endDate);

    const order: WorkOrderDocument = {

      docId: this.editingOrder()?.docId ?? this.generateUUID(),
      docType: 'workOrder',
      data: {
        name: this.form.value.name!,
        status: this.form.value.status! as WorkOrderStatus,
        workCenterId: this.workCenterId(),
        startDate: start,
        endDate: end
      }
    };

    this.save.emit(order);
  }

  toISO = (d: NgbDateStruct) => {
    return new Date(d.year, d.month - 1, d.day).toISOString().slice(0, 10);
  };

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}


/**
 * @UPGRADES
 * 1. Show the actual dates in the date picker when initially opening the panel
 * 2. Position the bars in the actual dates (it starts 1 day prior)
 * 3. Fix the calculations for the width and position of the bars to a more correct one
 * 4. Code clean up (unit test, use a main service to handle all work orders related logic)
 * 5. Remove unused scss
 * 6. Add tooltips
 * 8. Better hover styling
 * 9. Show current time style
 */