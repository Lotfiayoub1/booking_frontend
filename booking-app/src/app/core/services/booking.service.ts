import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/me`);
  }

  createBooking(body: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiUrl}/bookings`, body);
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${environment.apiUrl}/bookings/${id}/cancel`, {});
  }
}
