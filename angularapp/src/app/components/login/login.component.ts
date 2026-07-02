import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }
//   onSubmit(): void {
//     this.submitted = true;
  
//     if (this.loginForm.invalid) {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       return;
//     }

//     const loginData: Login = this.loginForm.value;

//     Swal.fire({
//       title: 'Logging in...',
//       allowOutsideClick: false,
//       didOpen: () => {
//         Swal.showLoading();
//       }
//     });

//     this.authService.login(loginData).subscribe(
//       response => {
//         Swal.close();

//         const user = response.User;
//         const role = user.UserRole;

//         // Store user and token
//         localStorage.setItem('jwtToken', response.token);
//         localStorage.setItem('currentUser', JSON.stringify(user));

//         // Navigate based on role
//         if (role === 'Admin') {
//           this.router.navigate(['/home']);
//         } else if (role === 'User') {
//           this.router.navigate(['/home']);
//         } else {
//           this.router.navigate(['/home']);
//         }
//       },
//       error => {
//         Swal.close();
//         this.errorMessage = 'Login failed. Please try again.';
//       }
//     );
//   }
  
// }  
onSubmit(): void {
  this.submitted = true;

  if (this.loginForm.invalid) {
    const emailControl = this.loginForm.get('Email');
    const passwordControl = this.loginForm.get('Password');

    let errorMsg = '';
    if (emailControl?.errors?.required) {
      errorMsg = 'Email is required.';
    } else if (emailControl?.errors?.email) {
      errorMsg = 'Invalid email format.';
    } else if (passwordControl?.errors?.required) {
      errorMsg = 'Password is required.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: errorMsg || 'Please fill in all required fields correctly.',
    });
    return;
  }

  const loginData: Login = this.loginForm.value;

  Swal.fire({
    title: 'Logging in...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  this.authService.login(loginData).subscribe(
    response => {
      Swal.close();

      const user = response.User;
      const role = user.UserRole;

      localStorage.setItem('jwtToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome ${user.Username}!`,
      }).then(() => {
        if (role === 'Admin') {
                    this.router.navigate(['/admin/home']);
                  } else if (role === 'User') {
                    this.router.navigate(['user/home']);
                  } else {
                    this.router.navigate(['/home']);
                  }
      });
    },
    error => {
      Swal.close();
      const errorMsg = error.error?.Message || 'Login failed. Please check your credentials.';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
      });
    }
  );
}
}