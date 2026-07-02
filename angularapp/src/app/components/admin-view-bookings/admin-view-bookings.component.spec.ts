import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminViewBookingsComponent } from './admin-view-bookings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminViewBookingsComponent', () => {
  let component: AdminViewBookingsComponent;
  let fixture: ComponentFixture<AdminViewBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ AdminViewBookingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_AdminViewBookingsComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_booking_listings_heading_in_the_AdminViewBookingsComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Bookings Management');
  });
});
