import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkshopEvent } from 'src/app/models/workshop-event.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-view-workshop-event',
  templateUrl: './user-view-workshop-event.component.html',
  styleUrls: ['./user-view-workshop-event.component.css']
})
export class UserViewWorkshopEventComponent implements OnInit, OnDestroy {
  allEvents: WorkshopEvent[] = [];
  filteredEvents: WorkshopEvent[] = [];
  
  pageSize: number = 6;
  currentPage: number = 1;
  totalPages: number = 0;
  isLoading = true;
  
  private userId: number = 0;
  private registeredEventIds = new Set<number>();
  private destroy$ = new Subject<void>();

  private eventImageUrls: string[] = [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ];

  constructor(
    private workshopService: WorkshopEventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    forkJoin({
      events: this.workshopService.getAllWorkshopEvents(),
      bookings: this.workshopService.getAllWorkshopEventBookingsByUserId(this.userId)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ events, bookings }) => {
        this.registeredEventIds = new Set(bookings.map(b => b.WorkshopEventId));
        
        const now = new Date();
        const upcomingEvents = events.filter(event => new Date(event.EndDateTime) > now);

        // Assign a unique display image to each event
        this.allEvents = upcomingEvents.map((event, index) => ({
          ...event,
          ImageUrl: this.eventImageUrls[index % this.eventImageUrls.length]
        }));
        
        this.totalPages = Math.ceil(this.allEvents.length / this.pageSize);
        
        this.updatePage();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching initial data:', err);
        this.isLoading = false;
      }
    });
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredEvents = this.allEvents.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  isRegistered(event: WorkshopEvent): boolean {
    return this.registeredEventIds.has(event.WorkshopEventId!);
  }

  registerEvent(eventId: number): void {
    this.router.navigate([`/user/user-book-workshop-event/${eventId}`]);
  }
}
