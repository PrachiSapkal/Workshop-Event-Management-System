import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkshopEvent } from '../models/workshop-event.model';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkshopEventService {
  public apiUrl =environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllWorkshopEvents(): Observable<WorkshopEvent[]> {
    return this.http.get<WorkshopEvent[]>(`${this.apiUrl}/api/workshop-event`, {
      headers: this.getAuthHeaders()
    });
  }

  addWorkshopEvent(event: WorkshopEvent): Observable<WorkshopEvent> {
    return this.http.post<WorkshopEvent>(`${this.apiUrl}/api/workshop-event`, event, {
      headers: this.getAuthHeaders()
    });
  }

  deleteWorkshopEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/workshop-event/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getWorkshopEventById(id: number): Observable<WorkshopEvent> {
    return this.http.get<WorkshopEvent>(`${this.apiUrl}/api/workshop-event/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateWorkshopEvent(id: number, event: WorkshopEvent): Observable<WorkshopEvent> {
    return this.http.put<WorkshopEvent>(`${this.apiUrl}/api/workshop-event/${id}`, event, {
      headers: this.getAuthHeaders()
    });
  }


  addWorkshopEventBooking(data: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/api/booking`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteWorkshopEventBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/booking/${bookingId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllWorkshopEventBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/api/bookings`, {
      headers: this.getAuthHeaders()
    });
  }

  updateWorkshopEventBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/api/booking/${id}`, booking, {
      headers: this.getAuthHeaders()
    });
  }

  getAllWorkshopEventBookingsByUserId(userId:number): Observable<Booking[]>{
    return this.http.get<Booking[]>(`${this.apiUrl}/api/booking/user/${userId}`,{
      headers: this.getAuthHeaders()
    });
  }

  uploadFile(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
  
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<{ filePath: string }>(
      `${this.apiUrl}/api/booking/upload`,
      formData,
      { headers }
    );
  }
  
  

  getFile(filename: string): Observable<Blob>{
    return this.http.get(`${this.apiUrl}/api/booking/view/${filename}`,{
      responseType: 'blob',
      headers: this.getAuthHeaders()
    }, );
  }
  getUserById(userId: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/api/users/userDetails/${userId}`,{
      headers: this.getAuthHeaders()
    });

}

}