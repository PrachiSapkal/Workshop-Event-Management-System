import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AdminCreateWorkshopEventComponent } from './admin-create-workshop-event.component';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { Router } from '@angular/router';

describe('AdminCreateWorkshopEventComponent', () => {
  let component: AdminCreateWorkshopEventComponent;
  let fixture: ComponentFixture<AdminCreateWorkshopEventComponent>;
  let workshopEventService: jasmine.SpyObj<WorkshopEventService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const workshopEventServiceSpy = jasmine.createSpyObj('WorkshopEventService', ['addWorkshopEvent']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [AdminCreateWorkshopEventComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: WorkshopEventService, useValue: workshopEventServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(AdminCreateWorkshopEventComponent);
    component = fixture.componentInstance;
    workshopEventService = TestBed.inject(WorkshopEventService) as jasmine.SpyObj<WorkshopEventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  fit('Frontend_should_create_AdminCreateWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_create_new_workshop_event_heading_in_the_AdminCreateWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Workshop Event');
  });

});
