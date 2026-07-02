import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public baseUrl = environment.apiUrl;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(newUser: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, newUser);
  }

  login(loginData: Login): Observable<any> {
    return this.http.post<{ token: string; User: User }>(`${this.baseUrl}/api/login`, loginData).pipe(
      tap(response => {
        const token = response.token;
        const user = response.User;

        if (token && user) {
          localStorage.setItem('jwtToken', token); // Correct key
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);//check
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.UserRole : null;
  }

  getUserId(): number | null {
    const user = this.currentUserValue;
    return user ? user.UserId : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

    // Get user info
    getUserInfo(): { id: number, username: string } {
      return {
        id: +localStorage.getItem('userId'),
        username: localStorage.getItem('username') || ''
      };
    }
}

