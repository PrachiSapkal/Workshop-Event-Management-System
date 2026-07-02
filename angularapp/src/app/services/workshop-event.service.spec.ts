import { TestBed } from '@angular/core/testing';

import { WorkshopEventService } from './workshop-event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkshopEventService', () => {
  let service: WorkshopEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WorkshopEventService);
  });

  fit('Frontend_should_create_workshopevent_service', () => {
    expect(service).toBeTruthy();
  });
});
