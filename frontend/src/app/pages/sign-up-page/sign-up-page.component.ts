import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-sign-up-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  isLoading = false;
  errorMessage = '';

  signUpForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [0, [Validators.required]],
    agreeToTerms: [false, [Validators.requiredTrue]]
  });

  onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { firstName, lastName, email, password, role } = this.signUpForm.value;
      
      this.authService.register({ 
        name: `${firstName} ${lastName}`,
        email: email!, 
        password: password!,
        role: role!
      }).subscribe({
        next: () => {
          this.isLoading = false;
          // Redirect is handled automatically in auth service
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signUpForm.controls).forEach(key => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    if (field?.hasError('required') && field.touched) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email') && field.touched) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength') && field.touched) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters long`;
    }
    if (field?.hasError('requiredTrue') && field.touched) {
      return 'You must agree to the terms and privacy policy';
    }
    return '';
  }
}
