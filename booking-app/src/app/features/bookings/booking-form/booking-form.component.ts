import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../../core/services/session.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatDividerModule, MatSnackBarModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private bookingService = inject(BookingService);
  private snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);

  session: Session | null = null;
  loadingSession = true;
  submitting = false;
  sessionError = '';

  form = this.fb.group({ notes: [''] });

  ngOnInit(): void {
    const sessionId = Number(this.route.snapshot.queryParamMap.get('sessionId'));
    if (!sessionId) { this.router.navigate(['/sessions']); return; }

    this.sessionService.getSession(sessionId).subscribe({
      next: (s) => { this.session = s; this.loadingSession = false; },
      error: () => { this.sessionError = 'Session not found.'; this.loadingSession = false; }
    });
  }

  onSubmit(): void {
    if (!this.session) return;
    this.submitting = true;
    this.bookingService.createBooking({
      sessionId: this.session.id,
      notes: this.form.value.notes || undefined
    }).subscribe({
      next: () => {
        this.snackBar.open('Booking confirmed!', 'Close', { duration: 4000, panelClass: 'snack-success' });
        this.router.navigate(['/bookings/me']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Booking failed. Please try again.', 'Close', { duration: 5000 });
        this.submitting = false;
      }
    });
  }
}
