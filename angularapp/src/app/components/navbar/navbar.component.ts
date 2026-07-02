
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent { 

  isLoggedIn: boolean = false;
  public aService: AuthService;

  constructor(private authService: AuthService){
    this.isLoggedIn = this.authService.isLoggedIn(); 
    this.aService = authService;
  }
}
