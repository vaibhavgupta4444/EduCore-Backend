import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ApiClient } from './api-client.service';
import { AuthResponse, LoginDto, RegisterDto } from './models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiClient = inject(ApiClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'edu_core_token';

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse, LoginDto>('/api/Auth/login', credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.redirectBasedOnRole();
        })
      );
  }

  register(userData: RegisterDto): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse, RegisterDto>('/api/Auth/register', userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.redirectBasedOnRole();
        })
      );
  }

  // Token management
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const decoded = this.decodeJWT(token);
      if (!decoded) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      this.removeToken();
      return false;
    }
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/']);
  }

  // JWT Helper methods
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decoded = this.decodeJWT(token);
    console.log('Decoded JWT token:', decoded); // Debug log
    
    // Common JWT role claim names
    const role = decoded?.role || decoded?.Role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    console.log('User role from token:', role); // Debug log
    
    return role;
  }

  private redirectBasedOnRole(): void {
    const role = this.getUserRole();
    
    if (role?.toLowerCase() === 'instructor') {
      this.router.navigate(['/instructor/dashboard']);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  // Test connection to backend
  testConnection(): Observable<any> {
    return this.apiClient.get('/api/Auth/test');
  }
}