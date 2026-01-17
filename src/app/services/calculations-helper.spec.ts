import { TestBed } from '@angular/core/testing';

import { CalculationsHelper } from './calculations-helper';

describe('CalculationsHelper', () => {
  let service: CalculationsHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationsHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
