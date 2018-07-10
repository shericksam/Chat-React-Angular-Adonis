import { TestBed, inject } from '@angular/core/testing';

import { ServiceApiService } from './service-api.service';

describe('ServiceApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceApiService]
    });
  });

  it('should be created', inject([ServiceApiService], (service: ServiceApiService) => {
    expect(service).toBeTruthy();
  }));
});
