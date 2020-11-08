import { TestBed } from '@angular/core/testing';

import { AuthenticationCodeServiceService } from './authentication-code-service.service';

describe('AuthenticationCodeServiceService', () => {
  let service: AuthenticationCodeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationCodeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
