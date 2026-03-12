import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type AuthRole = 'admin' | 'viewer';

export interface AuthUser {
  email: string;
  role: AuthRole;
  token: string;
  expiresAt: number;
  displayName?: string;
  avatarUrl?: string;
  provider?: 'google' | 'password';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'softvisionxr.auth';
  private readonly googleAuthApiUrl = `${environment.apiBaseUrl}/auth/google`;
  private readonly demoAuthApiUrl = `${environment.apiBaseUrl}/auth/demo`;
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.hydrateSession();
  }

  login(email: string, password: string): Observable<AuthUser> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.http.post<AuthUser>(this.demoAuthApiUrl, { email: normalizedEmail, password }).pipe(
      map((user) => {
        if (!user || !user.email || !user.token) {
          throw new Error('Invalid auth response from server.');
        }

        this.persistUser(user);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        const serverMessage = typeof error.error === 'object' ? error.error?.message : '';
        const message = serverMessage || error.message || 'Login failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  loginWithGoogle(idToken: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(this.googleAuthApiUrl, { idToken }).pipe(
      map((user) => {
        if (!user || !user.email || !user.token) {
          throw new Error('Invalid auth response from server.');
        }

        this.persistUser(user);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        const serverMessage = typeof error.error === 'object' ? error.error?.message : '';
        const message = serverMessage || error.message || 'Google login failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  getUser(): AuthUser | null {
    const user = this.userSubject.value;
    if (!user) {
      return null;
    }

    if (user.expiresAt <= Date.now()) {
      this.logout();
      return null;
    }

    return user;
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  hasRole(role: AuthRole): boolean {
    const user = this.getUser();
    if (!user) {
      return false;
    }

    const rank: Record<AuthRole, number> = {
      viewer: 1,
      admin: 2
    };

    return rank[user.role] >= rank[role];
  }

  getPostLoginRoute(user: AuthUser | null = this.getUser()): string {
    return user?.role === 'admin' ? '/admin' : '/';
  }

  private hydrateSession(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.userSubject.next(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed.expiresAt <= Date.now()) {
        this.logout();
        return;
      }

      this.userSubject.next(parsed);
    } catch {
      this.logout();
    }
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
