import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule, NgTemplateOutlet, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatTabsModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  bookings: Booking[] = [];
  loading = true;
  error = '';
  cancellingId: number | null = null;

  get upcomingBookings(): Booking[] {
    return this.bookings.filter(b => b.status !== 'cancelled' && new Date(b.sessionDate) >= new Date());
  }

  get pastBookings(): Booking[] {
    return this.bookings.filter(b => b.status !== 'cancelled' && new Date(b.sessionDate) < new Date());
  }

  get cancelledBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'cancelled');
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => { this.bookings = bookings; this.loading = false; },
      error: () => { this.error = 'Failed to load bookings.'; this.loading = false; }
    });
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Cancel your booking for "${booking.sessionTitle}"?`)) return;
    this.cancellingId = booking.id;
    this.bookingService.cancelBooking(booking.id).subscribe({
      next: (updated) => {
        const idx = this.bookings.findIndex(b => b.id === updated.id);
        if (idx !== -1) this.bookings[idx] = updated;
        this.snackBar.open('Booking cancelled.', 'Close', { duration: 3000 });
        this.cancellingId = null;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Could not cancel booking.', 'Close', { duration: 4000 });
        this.cancellingId = null;
      }
    });
  }

  getStatusColor(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      confirmed: 'primary',
      pending: 'accent',
      cancelled: 'warn'
    };
    return map[status];
  }

  getStatusIcon(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      confirmed: 'check_circle',
      pending: 'hourglass_empty',
      cancelled: 'cancel'
    };
    return map[status];
  }
}
