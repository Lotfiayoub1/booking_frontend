import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule, MatBadgeModule
  ],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss'
})
export class SessionListComponent implements OnInit {
  private sessionService = inject(SessionService);

  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  categories: string[] = [];
  loading = true;
  error = '';

  searchControl = new FormControl('');
  categoryControl = new FormControl('');

  ngOnInit(): void {
    this.loadSessions();
    this.loadCategories();

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.filteredSessions = sessions;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sessions. Please try again.';
        this.loading = false;
      }
    });
  }

  private loadCategories(): void {
    this.sessionService.getCategories().subscribe({
      next: (cats) => this.categories = cats
    });
  }

  applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const category = this.categoryControl.value || '';
    this.filteredSessions = this.sessions.filter(s => {
      const matchesSearch = !search ||
        s.title.toLowerCase().includes(search) ||
        s.instructor.toLowerCase().includes(search) ||
        s.description.toLowerCase().includes(search);
      const matchesCategory = !category || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
  }

  isAvailable(session: Session): boolean {
    return session.availableSlots > 0;
  }

  getAvailabilityClass(session: Session): string {
    if (session.availableSlots === 0) return 'unavailable';
    if (session.availableSlots <= 3) return 'limited';
    return 'available';
  }
}
