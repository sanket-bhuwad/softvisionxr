import { Component } from '@angular/core';
import { AuthService, AuthUser } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private authService: AuthService) {}

  get user(): AuthUser | null {
    return this.authService.getUser();
  }

  get displayName(): string {
    if (!this.user) {
      return 'Guest User';
    }

    return this.user.displayName || this.user.email;
  }

  get avatarText(): string {
    const source = this.displayName.trim();
    const parts = source.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
  }

  get authProviderLabel(): string {
    return this.user?.provider === 'google' ? 'Google Sign-In' : 'Email and Password';
  }
}
