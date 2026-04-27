import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss'
})
export class SessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  readonly authService = inject(AuthService);

  session: Session | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.sessionService.getSession(id).subscribe({
      next: (s) => { this.session = s; this.loading = false; },
      error: () => { this.error = 'Session not found.'; this.loading = false; }
    });
  }

  book(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/bookings/new'], { queryParams: { sessionId: this.session?.id } });
  }

  getAvailabilityPercent(): number {
    if (!this.session) return 0;
    return Math.round((this.session.availableSlots / this.session.capacity) * 100);
  }
}
