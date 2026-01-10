import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTimeline } from './work-order-timeline';

describe('WorkOrderTimeline', () => {
  let component: WorkOrderTimeline;
  let fixture: ComponentFixture<WorkOrderTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
