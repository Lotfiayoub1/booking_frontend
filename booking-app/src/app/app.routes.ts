import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/sessions', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'sessions',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/sessions/session-list/session-list.component').then(m => m.SessionListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/sessions/session-detail/session-detail.component').then(m => m.SessionDetailComponent)
      }
    ]
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    children: [
      {
        path: 'new',
        loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent)
      },
      {
        path: 'me',
        loadComponent: () => import('./features/bookings/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
      },
      { path: '', redirectTo: 'me', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/sessions' }
];
