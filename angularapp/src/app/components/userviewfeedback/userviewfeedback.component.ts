import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';
import { Feedback } from 'src/app/models/feedback.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view-feedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  isLoading = true;
  private userId: number;
  private destroy$ = new Subject<void>();

  constructor(
    private feedbackService: FeedbackService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadFeedbacks();
    } else {
      // Handle case where user is not logged in
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getAllFeedbacksByUserId(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.feedbacks = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching feedbacks:', err);
        this.isLoading = false;
      }
    });
  }

  showDeleteConfirmation(feedbackId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d9534f', // Themed red color
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFeedback(feedbackId);
      }
    });
  }

  private deleteFeedback(feedbackId: number): void {
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.FeedbackId !== feedbackId);
        Swal.fire(
          'Deleted!',
          'Your feedback has been successfully deleted.',
          'success'
        );
      },
      error: (err) => {
        console.error('Error deleting feedback:', err);
        Swal.fire(
          'Error!',
          'Could not delete the feedback. Please try again.',
          'error'
        );
      }
    });
  }

  goToPostFeedback(): void {
    this.router.navigate(['/user/useraddfeedback']);
  }
}
