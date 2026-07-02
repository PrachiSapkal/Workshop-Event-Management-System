import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAppliedWorkshopEventComponent } from './user-applied-workshop-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserAppliedWorkshopEventComponent', () => {
  let component: UserAppliedWorkshopEventComponent;
  let fixture: ComponentFixture<UserAppliedWorkshopEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserAppliedWorkshopEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppliedWorkshopEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_UserAppliedWorkshopEventComponent', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_applied_workshop_events_heading_in_the_UserAppliedWorkshopEventComponent', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Applied Workshop Events');
  });
});
