import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {
  public User_name: string = '';
  isLoggedIn: boolean = false;
  showLogoutModal: boolean = false;
  role: string = '';
  public aService: AuthService;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn(); 
    this.aService = authService;
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.User_name = user.Username;
        this.role = user.UserRole;
      }
    });
  }

  logout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    Swal.fire({
      title: 'Logging out...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
      this.showLogoutModal = false;
      Swal.close();
    }, 1500);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  navigateWithLoader(route: string) {
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    setTimeout(() => {
      this.router.navigate([route]);
      Swal.close();
    }, 1500);
  }
}
