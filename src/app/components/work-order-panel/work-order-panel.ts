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
  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
  form: any;

  constructor(private _fb: FormBuilder) {
    const end = new Date();
    end.setDate(end.getDate() + 7);

    this.form = this._fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: [this.toNgb(new Date()), Validators.required],
      endDate: [this.toNgb(end), Validators.required]
    });

    effect(() => {
      if (this.mode() === 'edit' && this.editingOrder()) {
        this.form.patchValue({
          name: this.editingOrder()!.data.name,
          status: this.editingOrder()!.data.status,
          startDate: this.toNgb(this.parseLocal(this.editingOrder()!.data.startDate)),
          endDate: this.toNgb(this.parseLocal(this.editingOrder()!.data.endDate)),
        });
        return;
      }

      if (this.mode() === 'create') {
        this.form.reset({
          status: 'open',
          startDate: this.toNgb(new Date()),
          endDate: this.toNgb(end),
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

  toNgb(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  parseLocal(date: string) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

}


/**
 * @UPGRADES
 * 1. Show the actual dates in the date picker when initially opening the panel
 * 4. Add unit tests.
 * 5. Remove unused scss
 * 8. Better hover styling
 * 9. Show current time style
 * 10. Show start-end dates for week views
 * 11. Show error for duplicates
 * 12. Don't allow user to add in columns that have full values
 */