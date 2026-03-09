import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactApiUrl = `${environment.apiBaseUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContactForm(payload: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.contactApiUrl, payload).pipe(
      catchError((error: HttpErrorResponse) => {
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
      })
    );
  }
}
