import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ContactService } from './contact.service';

interface ContactFormValue {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  submitSuccess = false;
  submitError = '';
  submitSuccessMessage = '';
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s()-]{8,20}$/)]],
      subject: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.contactForm.controls;
  }

  get messageLength(): number {
    const value = this.f['message'].value as string;
    return value ? value.length : 0;
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitSuccess = false;
    this.submitError = '';

    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.contactForm.value as ContactFormValue;
    const payload = {
      name: formValue.name.trim(),
      email: formValue.email.trim().toLowerCase(),
      phone: formValue.phone?.trim() || undefined,
      subject: formValue.subject.trim(),
      message: formValue.message.trim()
    };

    this.contactService
      .submitContactForm(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.submitSuccessMessage = response?.message || 'Thank you! Your message has been sent successfully. We will get back to you soon.';
          this.contactForm.reset();
          this.submitted = false;

          setTimeout(() => {
            this.submitSuccess = false;
            this.submitSuccessMessage = '';
          }, 5000);
        },
        error: (error: Error) => {
          this.submitError = error.message || 'We could not send your message right now. Please try again.';
        }
      });
  }
}
