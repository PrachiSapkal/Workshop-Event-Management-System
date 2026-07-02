import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { FeedbackService } from 'src/app/services/feedback.service';

import { WorkshopEvent } from 'src/app/models/workshop-event.model';
import { Booking } from 'src/app/models/booking.model';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // --- Properties ---
  username = 'Admin';
  totalWorkshops = 0;
  totalBookings = 0;
  totalFeedbacks = 0;
  isLoading = true;
  error: string | null = null;
  latestFeedback: Feedback | null = null;
  bookingStatusCounts: { [status: string]: number } = {};
  mostBookedWorkshops: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private workshopService: WorkshopEventService,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.username = currentUser.Username || 'Admin';
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      workshops: this.workshopService.getAllWorkshopEvents().pipe(catchError(() => of([]))),
      bookings: this.workshopService.getAllWorkshopEventBookings().pipe(catchError(() => of([]))),
      feedbacks: this.feedbackService.getFeedbacks().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (response) => {
        const workshops: WorkshopEvent[] = response.workshops;
        const bookings: Booking[] = response.bookings;
        const feedbacks: Feedback[] = response.feedbacks;

        // Stat Card Logic
        this.totalWorkshops = workshops.length;
        this.totalBookings = bookings.length;
        this.totalFeedbacks = feedbacks.length;

        // Calculations for Widgets
        this.findLatestFeedback(feedbacks);
        this.calculateBookingStatusCounts(bookings);
        this.calculateMostBookedWorkshops(workshops, bookings);

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'An error occurred while loading the dashboard.';
        this.isLoading = false;
      }
    });
  }
  
  private calculateBookingStatusCounts(bookings: Booking[]): void {
    const counts: { [status: string]: number } = {};
    for (const booking of bookings) {
      const status = booking.BookingStatus || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    }
    this.bookingStatusCounts = counts;
  }

  private calculateMostBookedWorkshops(workshops: WorkshopEvent[], bookings: Booking[]): void {
    const workshopMap = new Map<number, WorkshopEvent>();
    workshops.forEach(w => workshopMap.set(w.WorkshopEventId, w));

    const bookingCounts = new Map<number, number>();
    for (const booking of bookings) {
      const count = bookingCounts.get(booking.WorkshopEventId) || 0;
      bookingCounts.set(booking.WorkshopEventId, count + 1);
    }
    
    this.mostBookedWorkshops = Array.from(bookingCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([workshopId, count]) => {
        const workshopDetails = workshopMap.get(workshopId);
        return {
          title: workshopDetails?.EventName || `Workshop ${workshopId}`,
          count: count
        };
      });
  }

  private findLatestFeedback(feedbacks: Feedback[]): void {
    if (feedbacks.length === 0) {
      this.latestFeedback = null;
      return;
    }
    const sortedFeedbacks = [...feedbacks].sort((a, b) => 
      new Date(b.Date).getTime() - new Date(a.Date).getTime()
    );
    this.latestFeedback = sortedFeedbacks[0];
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
