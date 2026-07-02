import { Component, OnInit } from '@angular/core';
import { WorkshopEventService } from '../../services/workshop-event.service';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { WorkshopEvent } from '../../models/workshop-event.model';
import { BookingWithEvent } from 'src/app/models/bookingwithevent.model';

@Component({
  selector: 'app-admin-view-bookings',
  templateUrl: './admin-view-bookings.component.html',
  styleUrls: ['./admin-view-bookings.component.css']
})
export class AdminViewBookingsComponent implements OnInit {
  // Data properties
  bookingsWithDetails: BookingWithEvent[] = [];
  paginatedBookings: BookingWithEvent[] = [];
  errorMessage = '';
  isLoading = false;
  showImageModal = false;
  modalImageUrl = '';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10; // 
  totalPages = 0;

  constructor(private bookingService: WorkshopEventService) { }

  ngOnInit(): void {
    this.fetchBookingsWithDetails();
  }

  fetchBookingsWithDetails(): void {
    this.isLoading = true;
    this.bookingService.getAllWorkshopEventBookings().subscribe({
      next: async (bookings: Booking[]) => {
        try {
          const bookingWithDetails = await Promise.all(
            bookings.map(async (booking) => {
              try {
                const user = await this.bookingService.getUserById(booking.UserId).toPromise();
                const workshopEvent = await this.bookingService.getWorkshopEventById(booking.WorkshopEventId).toPromise();
                return { booking, user, workshopEvent };
              } catch {
                return null;
              }
            })
          );

          this.bookingsWithDetails = bookingWithDetails.filter(item => item !== null) as BookingWithEvent[];
          this.errorMessage = this.bookingsWithDetails.length === 0 ? 'No bookings found.' : '';
          
          this.goToPage(1);

        } catch {
          this.errorMessage = 'Failed to load user or event details';
        } finally {
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load bookings';
        this.isLoading = false;
      }
    });
  }

  updateStatus(booking: Booking, status: string): void {
    if (!booking || booking.BookingStatus === status) {
      return;
    }
    this.isLoading = true;
    booking.BookingStatus = status;
    this.bookingService.updateWorkshopEventBooking(booking.BookingId, booking).subscribe({
      next: () => {
        setTimeout(() => {
          this.fetchBookingsWithDetails();
        }, 500);
      },
      error: (err) => {
        alert('Failed to update booking status');
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteWorkshopEventBooking(id).subscribe({
        next: () => this.fetchBookingsWithDetails(),
        error: () => alert('Failed to delete booking')
      });
    }
  }

  openImageModal(proofFileName: string | undefined): void {
    if (!proofFileName) {
      alert('No proof available for this booking.');
      return;
    }
    this.modalImageUrl = `https://8080-dbbbfceebdbdabeadfcbbdcdabfdbdfafceffdacaeec.premiumproject.examly.io/proofs/${proofFileName}`;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.modalImageUrl = '';
  }
  
  // Pagination Logic (Unchanged)
  updatePaginatedBookings(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookings = this.bookingsWithDetails.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1) {
      page = 1;
    }
    this.totalPages = Math.ceil(this.bookingsWithDetails.length / this.itemsPerPage);
    if (page > this.totalPages && this.totalPages > 0) {
      page = this.totalPages;
    }
    this.currentPage = page;
    this.updatePaginatedBookings();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  get pages(): number[] {
    if (this.totalPages <= 0) return [];
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}

