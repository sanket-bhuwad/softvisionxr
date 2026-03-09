import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactApiUrl = `${environment.apiBaseUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContactForm(payload: ContactRequest): Observable<unknown> {
    return this.http.post(this.contactApiUrl, payload);
  }
}
