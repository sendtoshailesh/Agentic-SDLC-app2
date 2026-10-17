import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <app-navbar />
    <div class="home-container" data-testid="home-page">
      <h1>Welcome to Workshop App</h1>
      <p data-testid="placeholder-text">Features coming soon — this page will be replaced
      by the primary feature component during the workshop.</p>
    </div>
  `,
  styles: [`
    .home-container { max-width: 800px; margin: 40px auto; padding: 24px; text-align: center; }
  `],
})
export class HomeComponent {}
