import { TestBed } from '@angular/core/testing';

import { Authclear } from './authclear';

describe('Authclear', () => {
  let service: Authclear;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authclear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
