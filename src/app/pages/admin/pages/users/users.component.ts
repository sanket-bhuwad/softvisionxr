import { Component } from '@angular/core';
import { AuthRole, AuthService } from '../../../../core/auth/auth.service';
import { finalize } from 'rxjs/operators';
import { AdminUserItem, UsersService } from './users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  readonly roleOptions: AuthRole[] = ['viewer', 'admin'];
  users: AdminUserItem[] = [];
  isLoading = false;
  errorMessage = '';
  updatingEmail = '';

  constructor(private usersService: UsersService, private authService: AuthService) {
    this.loadUsers();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  updateRole(user: AdminUserItem, nextRole: AuthRole): void {
    if (!this.isAdmin || user.role === nextRole || this.updatingEmail) {
      return;
    }

    const previousRole = user.role;
    user.role = nextRole;
    this.updatingEmail = user.email;
    this.errorMessage = '';

    this.usersService
      .updateUser(user.email, { role: nextRole })
      .pipe(finalize(() => (this.updatingEmail = '')))
      .subscribe({
        next: (updatedUser) => this.replaceUser(updatedUser),
        error: (error: Error) => {
          user.role = previousRole;
          this.errorMessage = error.message;
        }
      });
  }

  toggleStatus(user: AdminUserItem): void {
    if (!this.isAdmin || this.updatingEmail) {
      return;
    }

    const previousStatus = user.status;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    user.status = nextStatus;
    this.updatingEmail = user.email;
    this.errorMessage = '';

    this.usersService
      .updateUser(user.email, { status: nextStatus })
      .pipe(finalize(() => (this.updatingEmail = '')))
      .subscribe({
        next: (updatedUser) => this.replaceUser(updatedUser),
        error: (error: Error) => {
          user.status = previousStatus;
          this.errorMessage = error.message;
        }
      });
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.usersService
      .getUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private replaceUser(updatedUser: AdminUserItem): void {
    this.users = this.users.map((item) => (item.email === updatedUser.email ? updatedUser : item));
  }
}
