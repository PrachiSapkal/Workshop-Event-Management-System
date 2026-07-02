import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserViewWorkshopEventComponent } from './user-view-workshop-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserViewWorkshopEventComponent', () => {
  let component: UserViewWorkshopEventComponent;
  let fixture: ComponentFixture<UserViewWorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserViewWorkshopEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewWorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_UserViewWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_available_workshop_events_heading_in_the_UserViewWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Workshop Events');
  });
});
