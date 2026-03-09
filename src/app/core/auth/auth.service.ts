import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface AuthUser {
  email: string;
  role: 'admin';
  token: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'softvisionxr.auth';

  constructor() {
    this.hydrateSession();
  }

  login(email: string, password: string): Observable<AuthUser> {
    const normalizedEmail = email.trim().toLowerCase();

    return of({ email: normalizedEmail, password }).pipe(
      delay(400),
      map((credentials) => {
        const isValid = credentials.email === 'admin@softvisionxr.com' && credentials.password === 'Admin@123';

        if (!isValid) {
          throw new Error('Invalid credentials. Please check email and password.');
        }

        const user: AuthUser = {
          email: credentials.email,
          role: 'admin',
          token: this.generateToken(),
          expiresAt: Date.now() + 1000 * 60 * 60 * 8
        };

        localStorage.setItem(this.storageKey, JSON.stringify(user));
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed.expiresAt <= Date.now()) {
        this.logout();
        return null;
      }

      return parsed;
    } catch {
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  hasRole(role: 'admin'): boolean {
    const user = this.getUser();
    return !!user && user.role === role;
  }

  private hydrateSession(): void {
    this.getUser();
  }

  private generateToken(): string {
    const payload = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return btoa(payload);
  }
}
