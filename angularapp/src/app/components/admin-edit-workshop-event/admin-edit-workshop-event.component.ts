import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { WorkshopEventService } from 'src/app/services/workshop-event.service';
import { WorkshopEvent } from 'src/app/models/workshop-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-workshop-event',
  templateUrl: './admin-edit-workshop-event.component.html',
  styleUrls: ['./admin-edit-workshop-event.component.css']
})
export class AdminEditWorkshopEventComponent implements OnInit {
  eventForm: FormGroup;
  otherCategoryControl = new FormControl('', Validators.required);
  successMessage = '';
  errorMessage = '';
  submitting = false;
  showOtherCategory = false;
  isLoading = true;
  eventId: number = 0;
  
  private predefinedCategories = ['Technical', 'Non-Technical', 'Soft Skills', 'Management'];

  constructor(
    private fb: FormBuilder,
    private workshopEventService: WorkshopEventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      EventName: ['', [Validators.required,this.lettersAndAtValidator]],
      OrganizerName: ['', [Validators.required,this.lettersAndAtValidator]],
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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No event ID provided. Cannot edit.';
      this.isLoading = false;
      return;
    }
    
    this.eventId = Number(idParam);
    this.loadEventData();
    this.addDateChangeListeners();
  }


  
  lettersAndAtValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^(?!\s*$)[A-Za-z0-9@ ]+$/;
    return value && !regex.test(value) ? { lettersAndAt: true } : null;
  }

  addDateChangeListeners(): void {
    const startControl = this.eventForm.get('StartDateTime');
    const endControl = this.eventForm.get('EndDateTime');

    startControl?.valueChanges.subscribe(() => {
        endControl?.updateValueAndValidity({ onlySelf: true });
    });

    endControl?.valueChanges.subscribe(() => {
        startControl?.updateValueAndValidity({ onlySelf: true });
    });
  }

  loadEventData(): void {
    this.workshopEventService.getWorkshopEventById(this.eventId).subscribe({
      next: (res: any) => {
        const event: WorkshopEvent = res.data;
        if (!event) {
            this.errorMessage = 'Could not find event data in the API response.';
            this.isLoading = false;
            return;
        }

        const formattedEvent = {
          ...event,
          StartDateTime: this.formatDateForInput(event.StartDateTime),
          EndDateTime: this.formatDateForInput(event.EndDateTime)
        };
        
        this.eventForm.patchValue(formattedEvent);
        
        if (!this.predefinedCategories.includes(event.Category)) {
          this.showOtherCategory = true;
          this.eventForm.get('Category')?.setValue('Others');
          this.otherCategoryControl.setValue(event.Category);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching event:', err);
        this.errorMessage = 'Failed to load event data. It may have been deleted.';
        this.isLoading = false;
      }
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    return `${d.getFullYear()}-${ten(d.getMonth() + 1)}-${ten(d.getDate())}T${ten(d.getHours())}:${ten(d.getMinutes())}`;
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

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }
    const now = new Date();
    return selectedDate > now ? null : { notFutureDate: true };
  }

  crossFieldDateValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('StartDateTime')?.value);
    const end = new Date(group.get('EndDateTime')?.value);

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) { return null; }
    if (start.getTime() === end.getTime()) { return { sameDateError: true }; }
    if (end <= start) { return { invalidDateRange: true }; }
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes < 30) { return { tooShortDuration: true }; }
    return null;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.eventForm.invalid || (this.showOtherCategory && this.otherCategoryControl.invalid)) {
      this.errorMessage = 'All fields are required and must be valid.';
      return;
    }
    
    this.submitting = true;
    const updatedEvent: WorkshopEvent = {
      ...this.eventForm.value,
      Category: this.showOtherCategory ? this.otherCategoryControl.value.trim() : this.eventForm.value.Category
    };

    this.workshopEventService.updateWorkshopEvent(this.eventId, updatedEvent).subscribe({
      next: () => {
        this.successMessage = 'Successfully Updated Workshop Event!';
        this.submitting = false;
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error:', err);
        this.errorMessage = err?.error?.message || 'Failed to update workshop event. Please try again.';
      }
    });
  }
  
  closeSuccessModal(): void {
    this.successMessage = '';
    this.router.navigate(['/admin/admin-view-workshop-event']);
  }

  goBack(): void {
    this.router.navigate(['/admin/admin-view-workshop-event']);
  }
}
