import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './allhome.component.html',
  styleUrls: ['./allhome.component.css']
})
export class AllHomeComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
