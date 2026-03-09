import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ContactService } from './contact.service';

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
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitSuccess = false;
    this.submitError = '';

    if (this.contactForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.contactService
      .submitContactForm(this.contactForm.value)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.contactForm.reset();
          this.submitted = false;

          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: () => {
          this.submitError = 'We could not send your message right now. Please try again.';
        }
      });
  }
}
