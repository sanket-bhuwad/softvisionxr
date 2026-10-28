import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      width?: number;
    }
  ): void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleWindow {
  accounts: GoogleAccounts;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';
  readonly isGoogleEnabled = !!environment.googleClientId;
  isGoogleLoading = false;
  isGoogleUnavailable = false;

  private googleInitAttempt = 0;
  private googleInitTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly maxGoogleInitAttempts = 20;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.preloadAdminModule();

    if (this.authService.isAuthenticated()) {
      this.redirectToReturnUrl();
    }
  }

  ngAfterViewInit(): void {
    this.initGoogleLogin();
  }

  ngOnDestroy(): void {
    this.clearGoogleInitTimer();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login(this.f['email'].value as string, this.f['password'].value as string)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.redirectToReturnUrl();
        },
        error: (error: Error) => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
  }

  private initGoogleLogin(): void {
    if (!this.isGoogleEnabled) {
      return;
    }

    const googleWindow = (window as unknown as { google?: GoogleWindow }).google;
    const buttonElement = document.getElementById('google-signin-button');

    if (!buttonElement) {
      return;
    }

    if (!googleWindow?.accounts?.id) {
      if (this.googleInitAttempt < this.maxGoogleInitAttempts) {
        this.googleInitAttempt += 1;
        this.googleInitTimer = setTimeout(() => this.initGoogleLogin(), 250);
      } else {
        this.isGoogleUnavailable = true;
      }
      return;
    }

    this.clearGoogleInitTimer();
    this.isGoogleUnavailable = false;

    googleWindow.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => this.onGoogleCredential(response)
    });

    buttonElement.innerHTML = '';
    googleWindow.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      text: 'continue_with',
      width: 320
    });
  }

  private onGoogleCredential(response: GoogleCredentialResponse): void {
    this.errorMessage = '';

    if (!response.credential || this.isGoogleLoading) {
      return;
    }

    this.isGoogleLoading = true;
    this.authService
      .loginWithGoogle(response.credential)
      .pipe(finalize(() => (this.isGoogleLoading = false)))
      .subscribe({
        next: () => this.redirectToReturnUrl(),
        error: (error: Error) => {
          this.errorMessage = error.message || 'Google login failed. Please try again.';
        }
      });
  }

  private redirectToReturnUrl(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.authService.getPostLoginRoute();
    this.router.navigateByUrl(returnUrl, { replaceUrl: true }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  private clearGoogleInitTimer(): void {
    if (this.googleInitTimer) {
      clearTimeout(this.googleInitTimer);
      this.googleInitTimer = null;
    }
  }

  private preloadAdminModule(): void {
    // Warm up the admin lazy chunk while user is on login screen.
    void import('../admin/admin.module');
  }
}
