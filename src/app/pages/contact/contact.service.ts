import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  message?: string;
}

interface FormSubmitResponse {
  message?: string;
  success?: string | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactApiUrl = environment.contactApiUrl || `${environment.apiBaseUrl}/contact`;
  private readonly formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(environment.contactRecipientEmail)}`;

  constructor(private http: HttpClient) {}

  submitContactForm(payload: ContactRequest): Observable<ContactResponse> {
    if (environment.contactMode === 'formsubmit') {
      const formSubmitPayload = {
        name: payload.name,
        email: payload.email,
        _replyto: payload.email,
        phone: payload.phone || 'Not provided',
        subject: payload.subject,
        message: payload.message,
        _subject: `Website Contact: ${payload.subject}`,
        _captcha: 'false',
        _template: 'table'
      };

      const requestBody = new HttpParams({ fromObject: formSubmitPayload }).toString();
      const requestHeaders = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      return this.http.post<FormSubmitResponse>(this.formSubmitUrl, requestBody, { headers: requestHeaders }).pipe(
        map((response) => {
          if (response.success === false || response.success === 'false') {
            throw new Error(response.message || 'The form service could not deliver your message. Please try again.');
          }

          return {
            message: response.message || 'Thank you! Your message has been sent successfully. We will get back to you soon.'
          };
        }),
        catchError((error: HttpErrorResponse | Error) => this.mapError(error))
      );
    }

    return this.http.post<ContactResponse>(this.contactApiUrl, payload).pipe(
      catchError((error: HttpErrorResponse | Error) => this.mapError(error))
    );
  }

  private mapError(error: HttpErrorResponse | Error): Observable<never> {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(() => error);
    }

    const serverMessage = typeof error.error === 'object' ? error.error?.message : undefined;
    if (serverMessage) {
      return throwError(() => new Error(serverMessage));
    }

    if (error.status === 0) {
      return throwError(() => new Error('Network error: please check your internet connection and try again.'));
    }

    if (error.status >= 500) {
      return throwError(() => new Error('Server error: please try again after some time.'));
    }

    return throwError(() => new Error('Unable to submit your message. Please verify your details and try again.'));
  }
}
