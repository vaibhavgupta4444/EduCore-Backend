import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../api/auth.service';

@Injectable({ providedIn: 'root' })
export class InstructorGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/signin']);
    }

    // Check if user has instructor or admin role
    const userRole = this.authService.getUserRole();
    if (userRole && (userRole.toLowerCase() === 'instructor' || userRole.toLowerCase() === 'admin')) {
      return true;
    }
    
    // Redirect to appropriate dashboard if not an instructor
    return this.router.createUrlTree(['/user/dashboard']);
  }
}