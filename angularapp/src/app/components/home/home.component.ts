import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { WorkshopEventService } from '../../services/workshop-event.service';
import { FeedbackService } from '../../services/feedback.service';
import { WorkshopEvent } from '../../models/workshop-event.model';
import { Booking } from '../../models/booking.model'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalWorkshopsFound = 0;
  registeredWorkshopsCount = 0;
  feedbackPostedCount = 0;
  latestEvent: WorkshopEvent | null = null;
  username = 'User';
  nextUpcomingEvent: WorkshopEvent | null = null;
  isLoading = true;
  error: string | null = null;
  
  constructor(
    private authService: AuthService, 
    private workshopService: WorkshopEventService,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  initializeDashboard(): void {
    const userId = this.authService.getUserId();
    const currentUser = this.authService.currentUserValue;

    if (currentUser && userId) {
      this.username = currentUser.Username || 'User';
      this.loadDashboardData(userId);
    } else {
      this.error = "Could not identify user. Please log in again.";
      this.isLoading = false;
    }
  }

  loadDashboardData(userId: number): void {
    this.isLoading = true;
    this.error = null;

    const allWorkshops$ = this.workshopService.getAllWorkshopEvents();
    const userBookings$ = this.workshopService.getAllWorkshopEventBookingsByUserId(userId); 
    const userFeedbacks$ = this.feedbackService.getAllFeedbacksByUserId(userId);

    forkJoin({
      allWorkshops: allWorkshops$.pipe(catchError(() => of([]))),
      userBookings: userBookings$.pipe(catchError(() => of([]))),
      userFeedbacks: userFeedbacks$.pipe(catchError(() => of([]))),
    }).subscribe({
      next: (response: any) => {
        const allWorkshops = response.allWorkshops.data || response.allWorkshops;
        const userBookings = response.userBookings.data || response.userBookings;
        const userFeedbacks = response.userFeedbacks.data || response.userFeedbacks;

        this.totalWorkshopsFound = allWorkshops.length;
        this.registeredWorkshopsCount = userBookings.length;
        this.feedbackPostedCount = userFeedbacks.length;

        if (allWorkshops.length > 0) {
          this.latestEvent = [...allWorkshops].sort((a, b) => (b.WorkshopEventId ?? 0) - (a.WorkshopEventId ?? 0))[0];
        }

        const bookedEventIds = new Set(userBookings.map((booking: Booking) => booking.WorkshopEventId));
        const userRegisteredWorkshops = allWorkshops.filter((workshop: WorkshopEvent) => bookedEventIds.has(workshop.WorkshopEventId));
        this.findNextUpcomingEvent(userRegisteredWorkshops);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = "An error occurred while loading your dashboard. Please try again later.";
        this.isLoading = false;
      }
    });
  }
  
  private findNextUpcomingEvent(bookedEvents: WorkshopEvent[]): void {
    const now = new Date();
    const upcoming = bookedEvents
      .filter(event => new Date(event.StartDateTime) > now)
      .sort((a, b) => new Date(a.StartDateTime).getTime() - new Date(b.StartDateTime).getTime());
    this.nextUpcomingEvent = upcoming.length > 0 ? upcoming[0] : null;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
  viewEventDetails(eventId?: number): void {
    this.router.navigate(['/user/user-view-workshop-event']);
  }
}
