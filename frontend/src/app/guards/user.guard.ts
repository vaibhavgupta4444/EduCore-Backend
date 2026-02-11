import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../api/auth.service';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/signin']);
    }

    // Check if user has User role (not instructor or admin)
    const userRole = this.authService.getUserRole();
    if (userRole && userRole.toLowerCase() === 'user') {
      return true;
    }
    
    // Redirect to appropriate dashboard if not a regular user
    if (userRole?.toLowerCase() === 'instructor') {
      return this.router.createUrlTree(['/instructor/dashboard']);
    } else if (userRole?.toLowerCase() === 'admin') {
      return this.router.createUrlTree(['/admin/dashboard']);
    }
    
    return this.router.createUrlTree(['/']);
  }
}
