import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  public User_name: string = '';
  public aService: AuthService;
  isLoggedIn: boolean = false;
  showLogoutModal: boolean = false;
  role: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.aService = authService;
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.User_name = user.Username;
        this.role = user.UserRole;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    Swal.fire({
      title: 'Logging out...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
      this.showLogoutModal = false;
      Swal.close();
    }, 1500);
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  navigateWithLoader(route: string): void {
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    setTimeout(() => {
      this.router.navigate([route]);
      Swal.close();
    }, 1500);
  }
}
