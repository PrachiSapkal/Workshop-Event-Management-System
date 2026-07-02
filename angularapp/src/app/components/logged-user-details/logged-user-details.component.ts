import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logged-user-details',
  templateUrl: './logged-user-details.component.html',
  styleUrls: ['./logged-user-details.component.css']
})
export class LoggedUserDetailsComponent implements OnInit {

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
    this.authservice.currentUser.subscribe(data => {
      this.user = data;
    })
  }

  user: User;

}