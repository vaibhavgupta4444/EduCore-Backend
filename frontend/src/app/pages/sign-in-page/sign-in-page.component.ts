import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-sign-in-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  isLoading = false;
  errorMessage = '';

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.signInForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.signInForm.value;
      
      this.authService.login({ 
        email: email!, 
        password: password! 
      }).subscribe({
        next: () => {
          this.isLoading = false;
          // Redirect is handled automatically in auth service
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signInForm.controls).forEach(key => {
      const control = this.signInForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.signInForm.get(fieldName);
    if (field?.hasError('required') && field.touched) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email') && field.touched) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength') && field.touched) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}
