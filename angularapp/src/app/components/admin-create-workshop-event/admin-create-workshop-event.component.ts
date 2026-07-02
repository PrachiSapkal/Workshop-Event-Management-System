import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { WorkshopEventService } from '../../services/workshop-event.service';
import { WorkshopEvent } from '../../models/workshop-event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-create-workshop-event',
  templateUrl: './admin-create-workshop-event.component.html',
  styleUrls: ['./admin-create-workshop-event.component.css']
})
export class AdminCreateWorkshopEventComponent {
  eventForm: FormGroup;
  otherCategoryControl = new FormControl('', Validators.required);
  successMessage = '';
  errorMessage = '';
  submitting = false;
  showOtherCategory = false;

  constructor(
    private fb: FormBuilder,
    private workshopEventService: WorkshopEventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      EventName: ['', [Validators.required, this.lettersAndAtValidator]],
      OrganizerName: ['', [Validators.required, this.lettersAndAtValidator]],
      Category: ['', Validators.required],
      Description: ['', [Validators.required,this.lettersAndAtValidator]],
      Location: ['', [Validators.required,this.lettersAndAtValidator]],
      StartDateTime: ['', [Validators.required, this.futureDateValidator]],
      EndDateTime: ['', Validators.required],
      Capacity: [1, [Validators.required, Validators.min(1)]]
    }, {
      validators: this.crossFieldDateValidator
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onCategoryChange(event: any): void {
    const selected = event.target.value;
    this.showOtherCategory = selected === 'Others';
    if (this.showOtherCategory) {
      this.otherCategoryControl.setValue('');
    }
  }

  lettersAndAtValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^(?!\s*$)[A-Za-z0-9@ ]+$/;
    return value && !regex.test(value) ? { lettersAndAt: true } : null;
  }


  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const now = new Date();
    return selectedDate > now ? null : { notFutureDate: true };
  }

  crossFieldDateValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('StartDateTime')?.value);
    const end = new Date(group.get('EndDateTime')?.value);

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    if (start.getTime() === end.getTime()) {
      return { sameDateError: true };
    }

    if (end <= start) {
      return { invalidDateRange: true };
    }

    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationMinutes < 30 ? { tooShortDuration: true } : null;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.eventForm.invalid || (this.showOtherCategory && this.otherCategoryControl.invalid)) {
      this.errorMessage = 'All fields are required and must be valid.';
      return;
    }

    this.submitting = true;
    const event: WorkshopEvent = {
      ...this.eventForm.value,
      Category: this.showOtherCategory ? this.otherCategoryControl.value.trim() : this.eventForm.value.Category
    };

    this.workshopEventService.addWorkshopEvent(event).subscribe({
      next: () => {
        this.successMessage = 'Successfully Created Workshop Event!';
        this.submitting = false;
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error:', err);
        this.errorMessage = err?.error?.message || 'Failed to create workshop event. Please try again.';
      }
    });
  }

  closeSuccessModal(): void {
    this.successMessage = '';
    this.eventForm.reset();
    this.router.navigate(['/admin/home']);
  }

  closeErrorModal(): void {
    this.errorMessage = '';
  }
}
