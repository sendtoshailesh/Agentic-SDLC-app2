import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="navbar" data-testid="navbar">
      <span class="navbar-brand">Workshop App</span>
      <button (click)="logout()" data-testid="logout-button">Logout</button>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 24px; background: #1976d2; color: white;
    }
    .navbar-brand { font-size: 1.2rem; font-weight: bold; }
    button {
      background: transparent; color: white; border: 1px solid white;
      padding: 6px 16px; cursor: pointer; border-radius: 4px;
    }
  `],
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
