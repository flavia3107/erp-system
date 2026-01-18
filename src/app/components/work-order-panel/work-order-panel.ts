import { NgClass } from '@angular/common';
import { inject } from '@angular/core';
import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { WorkOrderDocument, WorkOrderStatus } from '../../shared/models/interfaces';
import { CalculationsHelper } from '../../services/calculations-helper';
import { Workorder } from '../../services/workorder';

@Component({
  selector: 'app-work-order-panel',
  imports: [ReactiveFormsModule, NgSelectComponent, NgbDatepickerModule, NgClass],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel {
  private _fb = inject(FormBuilder);
  private _calculationService = inject(CalculationsHelper);
  private _workOrderService = inject(Workorder);
  open = input<boolean>(false);
  mode = input<'create' | 'edit'>('create');
  workCenterId = input<string>('');
  workOrders = input<WorkOrderDocument[]>([]);
  editingOrder = input<WorkOrderDocument | undefined>();
  save = output<WorkOrderDocument>();
  cancel = output<void>();
  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
  form = this._fb.group({
    name: ['', Validators.required],
    status: ['open', Validators.required],
    startDate: [this._calculationService.toNgb(new Date()), Validators.required],
    endDate: [this._calculationService.toNgb(new Date()), Validators.required]
  });

  constructor() {
    effect(() => this._initialValuesLogic())
  }

  submit() {
    if (this.form.invalid) return;
    const { startDate, endDate } = this.form.value;

    const overlap = this.workOrders()
      .filter(o => o.data.workCenterId === this.workCenterId())
      .some(o =>
        new Date(o.data.startDate) <= new Date(this._calculationService.toISO(endDate!)) &&
        new Date(o.data.endDate) >= new Date(this._calculationService.toISO(startDate!))
      );

    if (overlap) {
      this.form.setErrors({ overlap: true });
      return;
    }

    const order = this._workOrderService.updateWorkorder({
      docId: this.editingOrder()?.docId,
      data: {
        name: this.form.value.name!,
        workCenterId: this.workCenterId(),
        status: this.form.value.status! as WorkOrderStatus,
        startDate: this._calculationService.toISO(this.form.value.startDate!),
        endDate: this._calculationService.toISO(this.form.value.endDate!)
      }
    });
    this.save.emit(order);
  }

  private _initialValuesLogic() {
    const end = new Date();
    end.setDate(end.getDate() + 7);
    this.form.patchValue({ endDate: this._calculationService.toNgb(end) });

    if (this.mode() === 'edit') {
      this.form.patchValue({
        name: this.editingOrder()!.data.name,
        status: this.editingOrder()!.data.status,
        startDate: this._calculationService.toNgb(this._calculationService.parseLocalDate(this.editingOrder()!.data.startDate)),
        endDate: this._calculationService.toNgb(this._calculationService.parseLocalDate(this.editingOrder()!.data.endDate)),
      });
    } else {
      this.form.reset({
        status: 'open',
        startDate: this._calculationService.toNgb(new Date()),
        endDate: this._calculationService.toNgb(end),
      });
      this.form.setErrors(null);
    }
  };
}

/**
 * @UPGRADES
 * 4. Add unit tests.
 * 5. Remove unused scss
 * 8. Better hover styling
 * 9. Show current time style
 * 10. Show start-end dates for week views
 * 11. Show error for duplicates
 * 12. Don't allow user to add in columns that have full values
 */