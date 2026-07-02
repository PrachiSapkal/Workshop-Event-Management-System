import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, of, forkJoin } from 'rxjs';
import { switchMap, catchError, takeUntil, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { BookingWithEvent } from 'src/app/models/bookingwithevent.model';
import { WorkshopEvent } from 'src/app/models/workshop-event.model';
import { Booking } from 'src/app/models/booking.model';

@Component({
  selector: 'app-user-applied-workshop-event',
  templateUrl: './user-applied-workshop-event.component.html',
  styleUrls: ['./user-applied-workshop-event.component.css']
})
export class UserAppliedWorkshopEventComponent implements OnInit, OnDestroy {
  bookings: BookingWithEvent[] = [];
  isLoading = true;
  errorMessage = '';
  
  showDeleteModal = false;
  showProofModal = false;
  bookingToDeleteId: number | null = null;
  
  proofFileUrl: SafeResourceUrl | null = null;
  proofFileType: string = '';

  private userId: number;
  private destroy$ = new Subject<void>();

  constructor(
    private bookingService: WorkshopEventService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadUserBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getAllWorkshopEventBookingsByUserId(this.userId).pipe(
      takeUntil(this.destroy$),
      switchMap((bookingList: Booking[]) => {
        if (!bookingList || bookingList.length === 0) {
          return of([]);
        }
        
        const detailedBookingObservables = bookingList.map(booking => 
          this.bookingService.getWorkshopEventById(booking.WorkshopEventId).pipe(
            //  to transform the response and handle nested data
            map((eventResponse: any) => {
              const workshopEventData = eventResponse.data || eventResponse;
              return { booking, workshopEvent: workshopEventData, user: null };
            }),
            catchError(() => of(null)) // If one event fails, return null for it
          )
        );
        
        return forkJoin(detailedBookingObservables); 
      })
    ).subscribe({
      next: (results) => {
        this.bookings = results.filter(item => item !== null && item.workshopEvent) as BookingWithEvent[];
        this.sortByDate('desc');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user bookings:', err);
        this.errorMessage = 'Failed to load your applied workshops. Please try again.';
        this.isLoading = false;
      }
    });
  }

  sortByDate(order: 'asc' | 'desc'): void {
    this.bookings.sort((a, b) => {
      const dateA = new Date(a.booking.BookingDate).getTime();
      const dateB = new Date(b.booking.BookingDate).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  viewProof(fileName: string): void {
    this.bookingService.getFile(fileName).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.proofFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.proofFileType = blob.type;
      this.showProofModal = true;
    });
  }

  cancelBooking(): void {
    if (this.bookingToDeleteId !== null) {
      this.bookingService.deleteWorkshopEventBooking(this.bookingToDeleteId).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.booking.BookingId !== this.bookingToDeleteId);
          this.closeDeleteConfirm();
        },
        error: (err) => {
          console.error('Failed to cancel booking:', err);
          this.errorMessage = 'Failed to cancel the booking. Please try again.';
          this.closeDeleteConfirm();
        }
      });
    }
  }

  openDeleteConfirm(bookingId: number): void {
    this.bookingToDeleteId = bookingId;
    this.showDeleteModal = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteModal = false;
    this.bookingToDeleteId = null;
  }

  closeProofModal(): void {
    this.showProofModal = false;
    this.proofFileUrl = null;
    this.proofFileType = '';
  }
}

