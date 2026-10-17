import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="email" name="email"
                 data-testid="email-input" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" type="password" [(ngModel)]="password" name="password"
                 data-testid="password-input" required />
        </div>
        @if (error) {
          <p class="error" data-testid="login-error">{{ error }}</p>
        }
        <button type="submit" data-testid="login-button">Login</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register</a></p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 80px auto; padding: 24px; }
    input { display: block; width: 100%; padding: 8px; margin: 8px 0 16px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #1976d2; color: white; border: none; cursor: pointer; }
    .error { color: red; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => this.error = err.error?.error || 'Login failed',
    });
  }
}
