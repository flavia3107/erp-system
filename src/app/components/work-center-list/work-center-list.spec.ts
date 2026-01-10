import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterList } from './work-center-list';

describe('WorkCenterList', () => {
  let component: WorkCenterList;
  let fixture: ComponentFixture<WorkCenterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkCenterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
