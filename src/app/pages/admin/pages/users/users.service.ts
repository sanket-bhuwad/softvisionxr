import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthRole } from '../../../../core/auth/auth.service';
import { environment } from '../../../../../environments/environment';

export interface AdminUserItem {
  name: string;
  email: string;
  role: AuthRole;
  status: 'active' | 'suspended';
  lastLogin: string;
}

interface AdminUserPatch {
  role?: AuthRole;
  status?: 'active' | 'suspended';
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly usersApiUrl = `${environment.apiBaseUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AdminUserItem[]> {
    return this.http.get<AdminUserItem[]>(this.usersApiUrl).pipe(catchError((error) => this.mapError(error)));
  }

  updateUser(email: string, patch: AdminUserPatch): Observable<AdminUserItem> {
    const encodedEmail = encodeURIComponent(email);
    return this.http
      .patch<AdminUserItem>(`${this.usersApiUrl}/${encodedEmail}`, patch)
      .pipe(catchError((error) => this.mapError(error)));
  }

  private mapError(error: HttpErrorResponse): Observable<never> {
    const serverMessage = typeof error.error === 'object' ? error.error?.message : undefined;
    if (serverMessage) {
      return throwError(() => new Error(serverMessage));
    }

    if (error.status === 0) {
      return throwError(() => new Error('Unable to connect to API server.'));
    }

    return throwError(() => new Error('Users API request failed. Please try again.'));
  }
}
