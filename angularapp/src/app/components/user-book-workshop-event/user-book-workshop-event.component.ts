import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-book-workshop-event',
  templateUrl: './user-book-workshop-event.component.html',
  styleUrls: ['./user-book-workshop-event.component.css']
})
export class UserBookWorkshopEventComponent implements OnInit {
  bookingForm: FormGroup;
  selectedFile: File | null = null;
  submitting = false;

  private workshopEventId: number = 0;
  private userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private workshopService: WorkshopEventService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(15), Validators.max(70)]],
      occupation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^(?!\s*$)[A-Za-z0-9@ ]+$/)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern( /^(?!\s*$)[A-Za-z0-9@ ]+$/)]],
      notes: ['',[Validators.pattern( /^(?!\s*$)[A-Za-z0-9@ .,]+$/)]],
      proof: [null, Validators.required] // Add proof to the form for validation
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.workshopEventId = Number(idParam);
    }
    this.userId = this.authService.getUserId();
  }

  get f() {
    return this.bookingForm.controls;
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.bookingForm.patchValue({ proof: file }); // Update form for validation
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }

    this.submitting = true;
    Swal.fire({
      title: 'Submitting Booking...',
      text: 'Please wait while we upload your proof and confirm your spot.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const bookingData: Booking = {
      BookingId: 0,
      UserId: this.userId,
      WorkshopEventId: this.workshopEventId,
      BookingStatus: 'Submitted',
      BookingDate: new Date(),
      Gender: this.f.gender.value,
      Age: this.f.age.value,
      Occupation: this.f.occupation.value,
      City: this.f.city.value,
      Proof: this.selectedFile!.name,
      AdditionalNotes: this.f.notes.value
    };

    // Correctly chain the API calls
    this.workshopService.uploadFile(this.selectedFile!).pipe(
      switchMap(() => this.workshopService.addWorkshopEventBooking(bookingData))
    ).subscribe({
      next: () => {
        Swal.fire({
          title: 'Booking Successful!',
          text: 'Your spot has been reserved. You will be redirected shortly.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/user/user-applied-workshop-event']);
        });
      },
      error: (err) => {
        console.error('Booking failed:', err);
        Swal.fire({
          title: 'Booking Failed',
          text: 'Something went wrong. Please try again later.',
          icon: 'error'
        });
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user/user-view-workshop-event']);
  }
}

