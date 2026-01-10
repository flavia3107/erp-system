import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCell } from './timeline-cell';

describe('TimelineCell', () => {
  let component: TimelineCell;
  let fixture: ComponentFixture<TimelineCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
