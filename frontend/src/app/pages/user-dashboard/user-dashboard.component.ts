import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../api/auth.service';
import { SharedNavbarComponent } from '../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-user-dashboard',
  imports: [SharedNavbarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/signin']);
    }
  }
}