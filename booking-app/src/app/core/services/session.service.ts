import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, SessionFilter } from '../models/session.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private http = inject(HttpClient);

  getSessions(filter?: SessionFilter): Observable<Session[]> {
    let params = new HttpParams();
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.date) params = params.set('date', filter.date);
    if (filter?.search) params = params.set('search', filter.search);
    return this.http.get<Session[]>(`${environment.apiUrl}/sessions`, { params });
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${environment.apiUrl}/sessions/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/sessions/categories`);
  }
}
