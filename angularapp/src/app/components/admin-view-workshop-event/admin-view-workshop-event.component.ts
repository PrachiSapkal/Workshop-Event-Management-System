import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkshopEvent } from '../../models/workshop-event.model';
import { WorkshopEventService } from '../../services/workshop-event.service';

@Component({
  selector: 'app-admin-view-workshop-event',
  templateUrl: './admin-view-workshop-event.component.html',
  styleUrls: ['./admin-view-workshop-event.component.css']
})
export class AdminViewWorkshopEventComponent implements OnInit {
  allEvents: WorkshopEvent[] = [];
  filteredEvents: WorkshopEvent[] = [];
  paginatedEvents: WorkshopEvent[] = [];
  loading = true;

  searchValue = '';
  successMessage = '';
  errorMessage = '';

  showConfirmationModal = false;
  modalTitle = '';
  modalMessage = '';
  private eventToDelete: WorkshopEvent | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // NEW: Success Modal
  showSuccessModal = false;
  successModalMessage = '';

  constructor(
    private workshopEventService: WorkshopEventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents(): void {
    this.loading = true;
    this.workshopEventService.getAllWorkshopEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.filteredEvents = events;
        this.loading = false;
        this.goToPage(1);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load workshop events. Please try again later.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchValue.toLowerCase().trim();
    this.filteredEvents = !query
      ? this.allEvents
      : this.allEvents.filter(e =>
          e.EventName.toLowerCase().includes(query) ||
          e.OrganizerName.toLowerCase().includes(query) ||
          e.Location.toLowerCase().includes(query)
        );
    this.goToPage(1);
  }

  onEdit(event: WorkshopEvent): void {
    this.router.navigate(['/admin/admin-edit-workshop-event', event.WorkshopEventId]);
  }

  openDeleteConfirmation(event: WorkshopEvent): void {
    this.eventToDelete = event;
    this.modalTitle = 'Confirm Deletion';
    this.modalMessage = `Are you sure you want to delete the event "${event.EventName}"? This action cannot be undone.`;
    this.showConfirmationModal = true;
  }

  closeModal(): void {
    this.showConfirmationModal = false;
    this.eventToDelete = null;
  }

  confirmAction(): void {
    if (this.eventToDelete && this.eventToDelete.WorkshopEventId) {
      this.workshopEventService.deleteWorkshopEvent(this.eventToDelete.WorkshopEventId).subscribe({
        next: () => {
          this.successModalMessage = `Event "${this.eventToDelete?.EventName}" was deleted successfully.`;
          this.showSuccessModal = true;
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete the event. Please try again.';
          console.error(err);
          this.closeModal();
        }
      });
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.loadAllEvents();
  }

  updatePaginatedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.updatePaginatedEvents();
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
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}
