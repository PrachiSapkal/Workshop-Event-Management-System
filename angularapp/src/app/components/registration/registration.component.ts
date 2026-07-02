import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  showSecretKey: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\s*$)[A-Za-z0-9@ ]+$/)]],
      Email: ['', [Validators.required, Validators.email]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
     
Password: ['', [
  Validators.required,
  Validators.minLength(6),
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
]],
      ConfirmPassword: ['', Validators.required],
      UserRole: ['', Validators.required],
      SecretKey: ['']
    }, { validators: this.passwordMatchValidator });

    this.registrationForm.get('UserRole')?.valueChanges.subscribe(role => {
      this.showSecretKey = role === 'Admin';
      const secretKeyControl = this.registrationForm.get('SecretKey');
      if (role === 'Admin') {
        secretKeyControl?.setValidators([Validators.required]);
      } else {
        secretKeyControl?.clearValidators();
      }
      secretKeyControl?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }
  
    const formValue = this.registrationForm.value;
    const user: User = {
      UserId: 0,
      Username: formValue.Username,
      Email: formValue.Email,
      MobileNumber: formValue.MobileNumber,
      Password: formValue.Password,
      UserRole: formValue.UserRole,
      SecretKey: formValue.SecretKey
    };
  
    Swal.fire({
      title: 'Registering...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.authService.register(user).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Registered Successfully!',
          text: 'You will now be redirected to the login page.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.registrationForm.reset();
          this.router.navigate(['/login']);
        });
      },
      error => {
        

        Swal.close();
        const errorMsg = error.error?.Message || 'Registration failed. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorMsg,
        });
        console.error(error);
  

      }
    );
  }
  
}
