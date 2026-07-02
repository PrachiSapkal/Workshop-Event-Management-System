import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminViewWorkshopEventComponent } from './admin-view-workshop-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminViewWorkshopEventComponent', () => {
  let component: AdminViewWorkshopEventComponent;
  let fixture: ComponentFixture<AdminViewWorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ AdminViewWorkshopEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewWorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_AdminViewWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Workshop_Event_Listings_heading_in_the_AdminViewWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Workshop Event Listings');
  });
});
