import { TestBed } from '@angular/core/testing';

import { BackendCommunication } from './backend-communication';

describe('BackendCommunication', () => {
  let service: BackendCommunication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendCommunication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
