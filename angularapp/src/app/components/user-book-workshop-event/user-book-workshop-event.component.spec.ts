import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBookWorkshopEventComponent } from './user-book-workshop-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserBookWorkshopEventComponent', () => {
  let component: UserBookWorkshopEventComponent;
  let fixture: ComponentFixture<UserBookWorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ UserBookWorkshopEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBookWorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_UserBookWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_workshop_event_booking_form_heading_in_the_UserBookWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Workshop Event Booking Form');
  });
});
