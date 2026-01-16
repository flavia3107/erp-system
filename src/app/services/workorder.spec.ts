import { TestBed } from '@angular/core/testing';

import { Workorder } from './workorder';

describe('Workorder', () => {
  let service: Workorder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workorder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
