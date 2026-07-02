import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    const userId = userIdParam ? parseInt(userIdParam, 10) : null;

    if (userId !== null && !isNaN(userId)) {
      this.fetchUserDetails(userId);
      this.errorMessage = 'Invalid user ID';
      this.isLoading = false;
    }
  }

  fetchUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.errorMessage = 'Failed to load user details';
        this.isLoading = false;
      }
    });
  }
}
