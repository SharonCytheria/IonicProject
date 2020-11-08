import { TestBed } from '@angular/core/testing';

import { CategoryListServiceService } from './category-list-service.service';

describe('CategoryListServiceService', () => {
  let service: CategoryListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
