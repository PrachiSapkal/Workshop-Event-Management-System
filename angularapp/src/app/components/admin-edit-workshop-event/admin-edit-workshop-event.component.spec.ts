import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdminEditWorkshopEventComponent } from './admin-edit-workshop-event.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdminEditWorkshopEventComponent', () => {
  let component: AdminEditWorkshopEventComponent;
  let fixture: ComponentFixture<AdminEditWorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [AdminEditWorkshopEventComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 456 }), // Mock ID for testing
            snapshot: {
              paramMap: {
                get: () => '456',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditWorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_AdminEditWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_edit_workshop_event_heading_in_the_AdminEditWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Edit Workshop Event');
  });
});
