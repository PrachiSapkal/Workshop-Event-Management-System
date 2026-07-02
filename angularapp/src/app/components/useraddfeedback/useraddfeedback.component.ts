
 
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-user-add-feedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {

  constructor(
    private service: FeedbackService,
    private authservice: AuthService,
    private route: Router
  ) {
    this.authservice.currentUser.subscribe(user => {
      this.userId = user.UserId;
    });
  }

  userId: number = 0;
  feedbackText: string = '';
  submitted: boolean = false;
  successMessage: string = '';
  showValidationError: boolean = false;

  onSubmit(): void {
    this.submitted = true;

    const isValidFeedback = this.feedbackText.trim().length > 0 &&
                            /^[a-zA-Z0-9\s]+$/.test(this.feedbackText);

    if (!isValidFeedback) {
      this.showValidationError = true;
      Swal.fire({
        title: 'Failed to add feedback!',
        text: 'Feedback must contain only letters, numbers, and spaces.',
        icon: 'error',
        allowOutsideClick: false,
      });
      return;
    }

    const feedback: Feedback = {
      UserId: this.userId,
      FeedbackText: this.feedbackText,
      Date: new Date()
    };

    this.service.sendFeedback(feedback).subscribe();

    Swal.fire({
      title: 'Feedback Submitted Successfully',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.showValidationError = false;
    this.feedbackText = '';
    this.submitted = false;

    setTimeout(() => {
      this.route.navigate(['user/userviewfeedback']);
      Swal.close();
    }, 2000);
  }

  closePopup(): void {
    this.successMessage = '';
  }

  ngOnInit(): void {}
}

